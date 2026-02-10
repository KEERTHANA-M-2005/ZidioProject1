// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getUploadHistoryByUserId } = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { promoteUser, demoteUser, deleteUser } = require('../controllers/adminController');

// ✅ Admin route to get upload history for a specific user
router.get('/user/:id/history', protect, adminOnly, getUploadHistoryByUserId);

// Admin controls
router.post('/user/:id/promote', protect, adminOnly, promoteUser);
router.post('/user/:id/demote', protect, adminOnly, demoteUser);
router.delete('/user/:id', protect, adminOnly, deleteUser);

module.exports = router;
