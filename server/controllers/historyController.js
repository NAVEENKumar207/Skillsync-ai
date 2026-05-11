const AnalysisHistory = require("../models/AnalysisHistory");
const checkDB = require("../utils/checkDB");

/**
 * Controller for managing analysis history.
 */

// Save a new analysis entry
exports.saveHistory = async (req, res) => {
  if (!checkDB(res)) return;
  const { analysis, company, role } = req.body;
  
  try {
    if (!analysis || !company || !role) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    
    const historyEntry = await AnalysisHistory.create({
      userId: req.user._id,
      analysis,
      company,
      role,
      date: new Date().toLocaleDateString()
    });
    
    res.status(201).json(historyEntry);
  } catch (err) {
    console.error("Save History Error:", err.message);
    res.status(500).json({ error: "Failed to save history." });
  }
};

// Get all history entries for a user
exports.getHistory = async (req, res) => {
  if (!checkDB(res)) return;
  
  try {
    const history = await AnalysisHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error("Get History Error:", err.message);
    res.status(500).json({ error: "Failed to fetch history." });
  }
};

// Delete a history entry
exports.deleteHistory = async (req, res) => {
  if (!checkDB(res)) return;
  
  try {
    const result = await AnalysisHistory.deleteOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "History entry not found." });
    }
    
    res.json({ message: "History entry deleted." });
  } catch (err) {
    console.error("Delete History Error:", err.message);
    res.status(500).json({ error: "Failed to delete history entry." });
  }
};

// Update a history entry (company/role)
exports.updateHistory = async (req, res) => {
  if (!checkDB(res)) return;
  const { company, role } = req.body;
  
  try {
    const history = await AnalysisHistory.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { company, role },
      { new: true }
    );
    
    if (!history) return res.status(404).json({ error: "History entry not found." });
    
    res.json(history);
  } catch (err) {
    console.error("Update History Error:", err.message);
    res.status(500).json({ error: "Failed to update history entry." });
  }
};
