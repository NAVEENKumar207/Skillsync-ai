const express = require("express");
const resumeController = require("../controllers/resumeController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

/**
 * Resume Parsing Routes
 */

router.post("/parse-resume", upload.single("file"), resumeController.parseResume);

module.exports = router;
