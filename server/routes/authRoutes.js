const express = require("express");
const authController = require("../controllers/authController");
const authenticateToken = require("../middlewares/authMiddleware");
const { authLimiter } = require("../middlewares/rateLimitMiddleware");

const router = express.Router();

/**
 * Authentication Routes
 */

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/me", authenticateToken, authController.getMe);

module.exports = router;
