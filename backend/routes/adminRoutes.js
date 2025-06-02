// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getUploadHistoryByUserId } = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ✅ Admin route to get upload history for a specific user
router.get('/user/:id/history', protect, adminOnly, getUploadHistoryByUserId);

module.exports = router;
