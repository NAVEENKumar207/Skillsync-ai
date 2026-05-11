const resumeService = require("../services/resumeService");

/**
 * Controller for handling resume file parsing requests.
 */

exports.parseResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const text = await resumeService.parseResumeFile(req.file);
    res.json({ text, filename: req.file.originalname });
  } catch (err) {
    console.error("Resume Parse Error:", err.message);
    res.status(500).json({
      error: err.message || "Failed to parse file. Try pasting your resume as text."
    });
  }
};
