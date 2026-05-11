const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/historyRoutes");
const aiRoutes = require("./routes/aiRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const profileRoutes = require("./routes/profileRoutes");
const errorHandler = require("./middlewares/errorMiddleware");
const { limiter } = require("./middlewares/rateLimitMiddleware");

/**
 * Express Application Configuration.
 * Configures middleware, security, logging, and routes.
 */

const app = express();

// Trust proxy for rate limiting (needed when behind a proxy like Nginx, Heroku, etc.)
app.set("trust proxy", 1);

/* ─── Security Headers ────────────────────────────────────────────── */
app.use(helmet({
  contentSecurityPolicy: false, // Allow frontend dev server
  crossOriginEmbedderPolicy: false
}));

/* ─── Logging ───────────────────────────────────────────────────── */
app.use(morgan(":method :url :status :response-time ms - :res[content-length]"));

/* ─── Rate Limiting ─────────────────────────────────────────────── */
app.use(limiter);

/* ─── CORS & Body Parsing ────────────────────────────────────────── */
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* ─── Routes ────────────────────────────────────────────────────── */

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "SkillSync AI Backend Running 🚀",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    ai_provider: "Groq AI",
    configured: true
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/profile", profileRoutes);
app.use("/api/history", historyRoutes);
app.use("/api", aiRoutes);
app.use("/api", resumeRoutes);

/* ─── Error Handling ────────────────────────────────────────────── */
app.use(errorHandler);

module.exports = app;
