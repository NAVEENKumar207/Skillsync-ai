// Test MongoDB connectivity
const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

// Use public DNS if local resolver fails
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const MONGO_URI = process.env.MONGO_URI;

console.log("Testing MongoDB connection...");
console.log("URI (masked):", MONGO_URI ? MONGO_URI.replace(/:([^@]+)@/, ":****@") : "NOT SET");

async function testConnection() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ Connection successful!");
    console.log("Host:", mongoose.connection.host);
    console.log("Database:", mongoose.connection.name);
    await mongoose.connection.close();
    console.log("Connection closed.");
  } catch (err) {
    console.error("\n❌ Connection failed:");
    console.error("Message:", err.message);
    console.error("Code:", err.code || "N/A");
    console.error("Name:", err.name);

    if (err.message.includes("ECONNREFUSED")) {
      console.error("\n🔍 Diagnosis: Cannot reach MongoDB Atlas.");
      console.error("   Possible causes:");
      console.error("   1. Network/VPN issue");
      console.error("   2. MongoDB Atlas cluster is paused");
      console.error("   3. Firewall blocking connection");
      console.error("   4. Wrong cluster address");
      console.error("\n💡 Try: Ping your cluster or check Atlas dashboard");
    }
  }
}

testConnection();
