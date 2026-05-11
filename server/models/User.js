const mongoose = require("mongoose");

/**
 * User Schema for SkillSync AI.
 * Stores user profile, credentials, and password reset tokens.
 */

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  favoriteColor: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true 
  },
  resetToken: { 
    type: String 
  },
  resetTokenExpiry: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
