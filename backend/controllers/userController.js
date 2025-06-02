// controllers/userController.js
const User = require("../models/User");

// ✅ Controller: Get logged-in user's profile
const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Controller: Admin fetches all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role createdAt");
    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserProfile,
  getAllUsers, // 👈 export it
};
