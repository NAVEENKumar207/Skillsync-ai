const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const { signToken } = require("../utils/token");
const checkDB = require("../utils/checkDB");

/**
 * Controller for authentication-related endpoints.
 */

// Register a new user
exports.register = async (req, res) => {
  if (!checkDB(res)) return;
  const { name, email, password, favoriteColor } = req.body;
  
  try {
    if (!name || !email || !password || !favoriteColor) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ 
      name, 
      email, 
      password: hashed, 
      favoriteColor: favoriteColor.toLowerCase() 
    });
    
    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};

// Login a user
exports.login = async (req, res) => {
  if (!checkDB(res)) return;
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "No account found with this email." });
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Incorrect password. Please try again." });
    }
    
    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

// Identity Challenge for Password Reset
exports.forgotPassword = async (req, res) => {
  if (!checkDB(res)) return;
  const { email, favoriteColor, lastPassword } = req.body;
  
  try {
    if (!email) return res.status(400).json({ error: "Email is required." });
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No account found with this email." });
    }

    let verified = false;

    // Challenge 1: Favorite Color
    if (favoriteColor && user.favoriteColor === favoriteColor.toLowerCase()) {
      verified = true;
    } 
    // Challenge 2: Last Password
    else if (lastPassword) {
      const match = await bcrypt.compare(lastPassword, user.password);
      if (match) verified = true;
    }

    if (!verified) {
      return res.status(401).json({ 
        error: "Identity verification failed. Please check your color or last password." 
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    res.json({
      message: "Identity verified. You may now reset your password.",
      resetToken
    });
  } catch (err) {
    console.error("Verification Error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  if (!checkDB(res)) return;
  const { token } = req.params;
  const { password } = req.body;
  
  try {
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }
    
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: "Reset session has expired or is invalid." });
    }
    
    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    res.json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    res.status(500).json({ error: "Password reset failed. Please try again." });
  }
};

// Get current logged in user
exports.getMe = async (req, res) => {
  if (!checkDB(res)) return;
  res.json({ user: req.user });
};
