const express = require("express");
const router = express.Router();
const { getDownloadHistory } = require("../controllers/downloadController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Route for users to access their own download history
router.get("/history/:userId", protect, getDownloadHistory);

// Route for admins to access any user's download history
router.get("/admin/history/:userId", protect, adminOnly, getDownloadHistory);

module.exports = router;
