const express = require("express");
const aiController = require("../controllers/aiController");

const router = express.Router();

/**
 * AI Routes
 */

router.post("/analyze", aiController.analyze);
router.post("/chat", aiController.chat);

module.exports = router;
