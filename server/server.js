const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dns = require("dns");
require("dotenv").config();

// Fix for MongoDB Atlas DNS resolution issues (SRV records)
// Often happens in local environments or some ISP settings
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

/* ══════════════════════════════════════════════════════════════════
   ENVIRONMENT VALIDATION
══════════════════════════════════════════════════════════════════ */
const requiredEnv = ["GROQ_API_KEY", "JWT_SECRET", "MONGO_URI"];
const missingEnv = requiredEnv.filter(key => !process.env[key]);

if (missingEnv.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingEnv.forEach(key => console.error(`   - ${key}`));
  console.error("\nPlease check your .env file and try again.");
  process.exit(1);
}

/* ─── Security Headers ────────────────────────────────────────────── */
app.use(helmet({
  contentSecurityPolicy: false, // Allow frontend dev server
  crossOriginEmbedderPolicy: false
}));

/* ─── Logging ───────────────────────────────────────────────────── */
app.use(morgan(":method :url :status :response-time ms - :res[content-length]"));

/* ─── Rate Limiting ─────────────────────────────────────────────── */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests from this IP. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: { error: "Too many authentication attempts. Please try again later." }
});

/* ─── CORS & Body Parsing ────────────────────────────────────────── */
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* ─── File Upload (Multer in-memory) ────────────────────────────── */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain"
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF, DOC, DOCX, or TXT files allowed."), false);
  }
});

/* ─── MongoDB Connection ─────────────────────────────────────────── */
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  // Connection options to handle network issues
  const options = {
    serverSelectionTimeoutMS: 30000, // Increased timeout
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
    retryWrites: true,
    w: 'majority',
    // DNS resolution workaround
    family: 4, // Force IPv4 (sometimes IPv6 causes issues)
  };

  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, options);
    console.log("✅ MongoDB connected to:", mongoose.connection.host);
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    console.error("   Code:", err.code || "N/A");
    console.error("   Name:", err.name);
    console.error("   Full URI:", MONGO_URI.replace(/:([^@]+)@/, ":****@"));

    // Specific troubleshooting for ECONNREFUSED
    if (err.message.includes("ECONNREFUSED")) {
      console.error("\n🔧 Troubleshooting steps:");
      console.error("   1. Check if cluster is active at https://cloud.mongodb.com");
      console.error("   2. Whitelist your IP in Atlas: Network Access → Add IP Address");
      console.error("   3. Try using mobile hotspot to rule out network restrictions");
      console.error("   4. Check Windows Firewall/Antivirus isn't blocking Node.js");
    }

    process.exit(1);
  }
};

/* ─── User Schema ────────────────────────────────────────────────── */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { type: String, required: true, minlength: 6 },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

/* ─── Helpers ────────────────────────────────────────────────────── */
const JWT_SECRET = process.env.JWT_SECRET;
const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

const checkDB = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      error: "Database not connected. Please check your MongoDB connection."
    });
    return false;
  }
  return true;
};

/* ─── Email Transporter ──────────────────────────────────────────── */
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

/* ══════════════════════════════════════════════════════════════════
   AUTH ROUTES
══════════════════════════════════════════════════════════════════ */

/* ── Register ──────────────────────────────────────────────────── */
app.post("/api/auth/register", authLimiter, async (req, res) => {
  if (!checkDB(res)) return;
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists." });
    }
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
app.post("/api/auth/login", authLimiter, async (req, res) => {
  if (!checkDB(res)) return;
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ error: "No account found with this email." });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ error: "Incorrect password. Please try again." });
    }
    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

/* ── Forgot Password ────────────────────────────────────────────── */
app.post("/api/auth/forgot-password", authLimiter, async (req, res) => {
  if (!checkDB(res)) return;
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ error: "Email is required." });
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "If an account exists, a reset email has been sent."
      });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000;
    await user.save();
    const resetURL = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

    if (transporter) {
      await transporter.sendMail({
        from: `"SkillSync AI" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password Reset Request - SkillSync AI",
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #0a0a0a; color: #ffffff; border-radius: 16px; border: 1px solid #222;">
            <h2 style="margin-bottom: 8px;">Reset Your Password</h2>
            <p style="color: #aaa; margin-bottom: 24px;">Click below to reset your SkillSync AI password. This link expires in <strong style="color:#fff">1 hour</strong>.</p>
            <a href="${resetURL}" style="display:inline-block;padding:14px 28px;background:#ffffff;color:#0a0a0a;border-radius:10px;font-weight:700;text-decoration:none;margin-bottom:24px;">
              Reset Password
            </a>
            <p style="color:#555;font-size:12px;">If you didn't request this, ignore this email.</p>
          </div>
        `
      });
    } else {
      console.log("\n" + "=".repeat(50));
      console.log("🔑 PASSWORD RESET REQUESTED");
      console.log(`📧 User Email: ${email}`);
      console.log(`🔗 RESET URL: ${resetURL}`);
      console.log("=".repeat(50) + "\n");
    }
    res.json({
      message: "If an account exists, a reset email has been sent."
    });
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
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() }
    });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Reset link is invalid or has expired." });
    }
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();
    res.json({
      message: "Password reset successful. You can now log in."
    });
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    res.status(500).json({ error: "Password reset failed. Please try again." });
  }
});

/* ── Get Current User ───────────────────────────────────────────── */
app.get("/api/auth/me", async (req, res) => {
  if (!checkDB(res)) return;
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ error: "User not found." });
    res.json({ user });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired. Please log in again." });
    }
    res.status(401).json({ error: "Invalid or expired token." });
  }
});

/* ══════════════════════════════════════════════════════════════════
   RESUME PARSE ROUTE — extracts text from PDF / DOCX / TXT
══════════════════════════════════════════════════════════════════ */
app.post("/api/parse-resume", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  try {
    const mime = req.file.mimetype;
    let text = "";

    if (mime === "application/pdf") {
      const data = await pdfParse(req.file.buffer);
      text = data.text;
    } else if (
      mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // DOCX file
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value;
    } else if (mime === "application/msword") {
      // Old DOC format - try to extract what we can
      text = req.file.buffer.toString("utf-8").replace(/[^\x20-\x7E\s]/g, "");
      if (text.trim().length < 20) {
        return res.status(422).json({
          error:
            "Could not extract text from .doc file. Please convert to .docx or .pdf and try again."
        });
      }
    } else {
      // Plain text
      text = req.file.buffer.toString("utf-8");
    }

    if (!text || text.trim().length < 20) {
      return res.status(422).json({
        error:
          "Could not extract text from this file. Please paste your resume text manually."
      });
    }

    res.json({ text: text.trim(), filename: req.file.originalname });
  } catch (err) {
    console.error("Resume Parse Error:", err.message);
    res.status(500).json({
      error: "Failed to parse file. Try pasting your resume as text."
    });
  }
});

/* ── Sanitization Helper ────────────────────────────────────────── */
const sanitizeResumeText = (text) => {
  if (!text) return "";
  // Remove potential password patterns, secrets, or common sensitive labels
  let cleanText = text
    .replace(/(password|passwd|secret|key|token|credential):\s*[^\s]+/gi, "[REDACTED]")
    .replace(/[a-zA-Z0-9+/]{40,}/g, "[TOKEN_REDACTED]") // Long random strings
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL_REDACTED]");

  return cleanText;
};

/* ══════════════════════════════════════════════════════════════════
   AI ANALYSIS ROUTE (Powered by Groq AI)
══════════════════════════════════════════════════════════════════ */
app.post("/api/analyze", async (req, res) => {
  const { resumeText, company, role } = req.body;

  if (!resumeText)
    return res.status(400).json({ error: "Resume text is required." });

  const sanitizedResume = sanitizeResumeText(resumeText);

  try {
    const companyContext = company
      ? `specifically for a career-defining ${role || "Software Engineer"} role at ${company}`
      : `for a high-level ${role || "Software Engineer"} position`;

    const prompt = `You are a world-class technical career advisor and recruiter. Analyze this resume specifically for the target listed below.

Provide an EXTREMELY GRANULAR AND DETAILED structured analysis with these EXACT sections:

## TARGET GOAL
State the target company (${company || "General"}) and the target role (${role || "Software Engineer"}).

## CANDIDATE PROFILE
Provide a concise professional summary of the candidate based STRICTLY ON THE RESUME ONLY. Do not assume any details not present in the text.

## SKILL GAPS
List 5 highly specific technical, architectural, or methodology gaps that separate the candidate from a "senior" level hire for this ${role} role at ${company}.

## 3-MONTH ROADMAP (GRANULAR & DETAILED)
Provide a week-by-week, day-by-day plan for ALL 3 MONTHS.
- **Month 1 (Deep Foundations)**: Provide a specific topic or task for EVERY SINGLE DAY of the month.
- **Month 2 (Implementation)**: Define a complex, production-grade project to build related to ${role}. Provide weekly milestones and a feature list.
- **Month 3 (Mastery & Career)**: Focus on specific advanced algorithms, system design patterns, and behavioral interview techniques for each week. Include specific resources or study topics.

## KEY STRENGTHS
List 3 unique competitive advantages found in the resume.

## QUICK WINS
List 3 high-impact actions to take within the next 48 hours to improve the candidate's professional presence.

Resume Text (Professional Context Only):
${sanitizedResume.substring(0, 8000)}`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a professional career coach and technical recruiter."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4096
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const analysis = response.data.choices[0].message.content;
    res.json({ analysis, company: company || "General" });
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.message;
    console.error("Groq Analysis Error:", errMsg);
    res.status(500).json({ error: `AI analysis failed: ${errMsg}` });
  }
});

/* ══════════════════════════════════════════════════════════════════
   AI CHAT ROUTE (Powered by Groq AI)
══════════════════════════════════════════════════════════════════ */
app.post("/api/chat", async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required." });

  try {
    const systemPrompt = `You are SkillSync AI Assistant, an expert career advisor. Be concise. Use bullet points. Keep under 200 words.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((h) => ({
        role: h.role === "model" ? "assistant" : "user",
        content: h.text
      })),
      { role: "user", content: message }
    ];

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.8,
        max_tokens: 1024
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.message;
    console.error("Groq Chat Error:", errMsg);
    res.status(500).json({ error: `Chat failed: ${errMsg}` });
  }
});

/* ── Health Check ──────────────────────────────────────────────── */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "SkillSync AI Backend Running 🚀",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    ai_provider: "Groq AI",
    configured: true
  });
});

/* ── Error Handler ────────────────────────────────────────────── */
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
});

/* ── Start Server ──────────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀  Server → http://localhost:${PORT}`);
  console.log(`📊  Environment: ${process.env.NODE_ENV || "development"}`);
});

/* ── Graceful Shutdown ──────────────────────────────────────────── */
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  server.close(async () => {
    console.log("HTTP server closed.");
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

/* ── Uncaught Error Handlers ───────────────────────────────────── */
process.on("uncaughtException", (err) => {
  console.error("FATAL: Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("FATAL: Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Connect to DB after setting up everything
connectDB();
