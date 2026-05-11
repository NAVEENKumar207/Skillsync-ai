const mongoose = require("mongoose");

/**
 * Analysis History Schema for SkillSync AI.
 * Tracks resume analyses performed by users.
 */

const analysisHistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  analysis: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const AnalysisHistory = mongoose.model("AnalysisHistory", analysisHistorySchema);

module.exports = AnalysisHistory;
