const User = require("../models/User");
const checkDB = require("../utils/checkDB");

/**
 * Controller for user profile management.
 */

// Update user profile
exports.updateProfile = async (req, res) => {
  if (!checkDB(res)) return;
  const { name, email } = req.body;
  
  try {
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    // Check if email is already taken by another user
    if (email !== req.user.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({ error: "Email is already in use." });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email: email.toLowerCase() },
      { new: true }
    ).select("-password");

    res.json({ user: updatedUser });
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    res.status(500).json({ error: "Failed to update profile." });
  }
};
