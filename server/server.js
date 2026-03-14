const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Fix ISP DNS blocking MongoDB SRV records

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

/* ─── Middleware ─────────────────────────────────────────────────── */
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* ─── MongoDB Connection ─────────────────────────────────────────── */
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skillsync";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected to:", mongoose.connection.host);
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    console.log("⚠️  Server will continue running without DB. Check your MONGO_URI and Atlas IP whitelist.");
  }
};
connectDB();

/* ─── User Schema ────────────────────────────────────────────────── */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

/* ─── Helpers ────────────────────────────────────────────────────── */
const JWT_SECRET = process.env.JWT_SECRET || "skillsync_jwt_2025";
const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

const checkDB = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ error: "Database not connected. Please check your MongoDB Atlas IP whitelist and try again." });
    return false;
  }
  return true;
};

/* ─── Email Transporter ──────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS   // Gmail App Password (not your regular password)
  }
});

/* ══════════════════════════════════════════════════════════════════
   AUTH ROUTES
══════════════════════════════════════════════════════════════════ */

/* ── Register ──────────────────────────────────────────────────── */
app.post("/api/auth/register", async (req, res) => {
  if (!checkDB(res)) return;
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required." });

    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters." });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "An account with this email already exists." });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

/* ── Login ─────────────────────────────────────────────────────── */
app.post("/api/auth/login", async (req, res) => {
  if (!checkDB(res)) return;
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "No account found with this email." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Incorrect password. Please try again." });

    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

/* ── Forgot Password ────────────────────────────────────────────── */
app.post("/api/auth/forgot-password", async (req, res) => {
  if (!checkDB(res)) return;
  const { email } = req.body;

  try {
    if (!email)
      return res.status(400).json({ error: "Email is required." });

    const user = await User.findOne({ email });

    // Always respond with success to prevent email enumeration
    if (!user)
      return res.json({ message: "If an account exists, a reset email has been sent." });

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetURL = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

    // Send email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"SkillSync AI" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password Reset Request - SkillSync AI",
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #0a0a0a; color: #ffffff; border-radius: 16px; border: 1px solid #222;">
            <h2 style="margin-bottom: 8px;">Reset Your Password</h2>
            <p style="color: #aaa; margin-bottom: 24px;">Click the button below to reset your SkillSync AI password. This link expires in <strong style="color:#fff">1 hour</strong>.</p>
            <a href="${resetURL}" style="display:inline-block;padding:14px 28px;background:#ffffff;color:#0a0a0a;border-radius:10px;font-weight:700;text-decoration:none;margin-bottom:24px;">
              Reset Password
            </a>
            <p style="color:#555;font-size:12px;">If you didn't request this, ignore this email.</p>
          </div>
        `
      });
    } else {
      // Dev mode: log token to console
      console.log("\n🔑 RESET TOKEN (dev mode):", resetToken);
      console.log("   Reset URL:", resetURL, "\n");
    }

    res.json({ message: "If an account exists, a reset email has been sent." });
  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

/* ── Reset Password ─────────────────────────────────────────────── */
app.post("/api/auth/reset-password/:token", async (req, res) => {
  if (!checkDB(res)) return;
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!password || password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters." });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ error: "Reset link is invalid or has expired." });

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    res.status(500).json({ error: "Password reset failed. Please try again." });
  }
});

/* ── Verify Token (Protected Route Helper) ──────────────────────── */
app.get("/api/auth/me", async (req, res) => {
  if (!checkDB(res)) return;
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ error: "No token provided." });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ error: "User not found." });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
});

/* ══════════════════════════════════════════════════════════════════
   AI ANALYSIS ROUTE
══════════════════════════════════════════════════════════════════ */
app.post("/api/analyze", async (req, res) => {
  const { resumeText, company } = req.body;

  if (!resumeText)
    return res.status(400).json({ error: "Resume text is required." });

  try {
    const companyContext = company
      ? `targeting a role at ${company}`
      : "for a general tech role";

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert AI career advisor. Analyze resumes, identify skill gaps, and create detailed, actionable preparation roadmaps. Be specific with resource recommendations and timelines."
          },
          {
            role: "user",
            content: `Analyze this resume ${companyContext}.\n\nProvide:\n1. TOP 5 SKILL GAPS (with brief explanation)\n2. 3-MONTH ROADMAP (with weekly milestones and specific resources)\n3. KEY STRENGTHS (2-3 points)\n\nResume:\n${resumeText}`
          }
        ],
        max_tokens: 900
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      analysis: response.data.choices[0].message.content,
      company: company || "General"
    });
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.message;
    console.error("AI Analysis Error:", errMsg);
    res.status(500).json({ error: `AI analysis failed: ${errMsg}` });
  }
});

/* ── Health Check ──────────────────────────────────────────────── */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "SkillSync AI Backend Running 🚀",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

/* ── Start Server ──────────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀  Server → http://localhost:${PORT}`));