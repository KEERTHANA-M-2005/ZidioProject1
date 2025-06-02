// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user", // can be "admin" or "user"
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Prevent OverwriteModelError during development/hot reload
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
