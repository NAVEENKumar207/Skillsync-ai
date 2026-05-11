const express = require("express");
const profileController = require("../controllers/profileController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * Profile Routes
 */

router.put("/", authenticateToken, profileController.updateProfile);

module.exports = router;
