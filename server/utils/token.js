const jwt = require("jsonwebtoken");

/**
 * Utility for JWT token operations.
 */

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Sign a new JWT token for a user ID.
 * @param {string} id - The user ID to encode in the token.
 * @returns {string} The signed JWT token.
 */
const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
};

module.exports = {
  signToken,
  JWT_SECRET
};
