const express = require("express");
const historyController = require("../controllers/historyController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * Analysis History Routes
 */

router.use(authenticateToken); // Protect all history routes

router.post("/", historyController.saveHistory);
router.get("/", historyController.getHistory);
router.delete("/:id", historyController.deleteHistory);
router.patch("/:id", historyController.updateHistory);

module.exports = router;
