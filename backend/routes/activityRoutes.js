const express = require('express');
const router = express.Router();
const {
  trackChartGeneration,
  trackDownload,
  getUserActivity,
  getUserActivityForAdmin, // 👈 Make sure this controller exists
} = require('../controllers/activityController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// User routes
router.get('/', protect, getUserActivity);
router.post('/track-chart', protect, trackChartGeneration);
router.post('/track-download', protect, trackDownload);

// Admin-only route
router.get('/admin/:userId', protect, adminOnly, getUserActivityForAdmin);

module.exports = router;
