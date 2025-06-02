const express = require("express");
const router = express.Router();
const { getUserProfile, getAllUsers } = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/profile", protect, getUserProfile);

// ✅ Admin can view all users
router.get("/all", protect, adminOnly, getAllUsers);

module.exports = router;
