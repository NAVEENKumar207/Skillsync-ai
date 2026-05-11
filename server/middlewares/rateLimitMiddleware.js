const rateLimit = require("express-rate-limit");

/**
 * Middleware for rate limiting requests.
 * Helps prevent brute-force attacks and abuse.
 */

// General API rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests from this IP. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: { error: "Too many authentication attempts. Please try again later." }
});

module.exports = {
  limiter,
  authLimiter
};
