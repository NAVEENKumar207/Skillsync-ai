const mongoose = require("mongoose");
const dns = require("dns");

/**
 * MongoDB connection configuration and logic.
 * Handles Atlas DNS resolution issues and connection lifecycle.
 */

// Fix for MongoDB Atlas DNS resolution issues (SRV records)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  // Connection options to handle network issues
  const options = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
    retryWrites: true,
    w: 'majority',
    // DNS resolution workaround
    family: 4, // Force IPv4
  };

  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, options);
    console.log("✅ MongoDB connected to:", mongoose.connection.host);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
