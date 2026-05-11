/**
 * Utility for sanitizing resume text to remove sensitive information.
 */

const sanitizeResumeText = (text) => {
  if (!text) return "";
  
  // Remove potential password patterns, secrets, or common sensitive labels
  let cleanText = text
    .replace(/(password|passwd|secret|key|token|credential):\s*[^\s]+/gi, "[REDACTED]")
    .replace(/[a-zA-Z0-9+/]{40,}/g, "[TOKEN_REDACTED]") // Long random strings
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL_REDACTED]");

  return cleanText;
};

module.exports = {
  sanitizeResumeText
};
