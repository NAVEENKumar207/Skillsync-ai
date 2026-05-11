const mongoose = require("mongoose");

/**
 * Utility to check the status of the MongoDB connection.
 * Used in routes to prevent operations if the DB is disconnected.
 */

const checkDB = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      error: "Database not connected. Please check your MongoDB connection."
    });
    return false;
  }
  return true;
};

module.exports = checkDB;
