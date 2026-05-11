require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");
const validateEnv = require("./config/env");

/**
 * Server Startup Script.
 * Validates environment, connects to database, and starts the HTTP server.
 */

// Validate required environment variables
validateEnv();

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀  Server → http://localhost:${PORT}`);
  console.log(`📊  Environment: ${process.env.NODE_ENV || "development"}`);
});

// Connect to MongoDB
connectDB();

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
