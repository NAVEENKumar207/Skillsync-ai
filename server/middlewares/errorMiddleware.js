/**
 * Centralized error handling middleware.
 * Catches all unhandled errors and sends a formatted JSON response.
 */

const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Error:", err);
  
  const statusCode = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    error: message,
    // Include stack trace only in development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

module.exports = errorHandler;
