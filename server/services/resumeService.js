const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Service for parsing different resume file formats.
 */

const parseResumeFile = async (file) => {
  const mime = file.mimetype;
  let text = "";

  if (mime === "application/pdf") {
    const data = await pdfParse(file.buffer);
    text = data.text;
  } else if (
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    // DOCX file
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    text = result.value;
  } else if (mime === "application/msword") {
    // Old DOC format - try to extract what we can
    text = file.buffer.toString("utf-8").replace(/[^\x20-\x7E\s]/g, "");
    if (text.trim().length < 20) {
      throw new Error("Could not extract text from .doc file. Please convert to .docx or .pdf and try again.");
    }
  } else {
    // Plain text
    text = file.buffer.toString("utf-8");
  }

  if (!text || text.trim().length < 20) {
    throw new Error("Could not extract text from this file. Please paste your resume text manually.");
  }

  return text.trim();
};

module.exports = {
  parseResumeFile
};
