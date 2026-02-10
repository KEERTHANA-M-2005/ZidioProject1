const express = require('express');
const router = express.Router();
const {
  trackChartGeneration,
  trackDownload,
  getUserActivity,
  getUserActivityForAdmin,
  getAllActivities,
  trackVisit,
} = require('../controllers/activityController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// User routes
router.get('/', protect, getUserActivity);
router.post('/track-chart', protect, trackChartGeneration);
router.post('/track-download', protect, trackDownload);
router.post('/track-visit', protect, trackVisit);

// Admin-only route: return flattened list of all activities
router.get('/all', protect, adminOnly, getAllActivities);

module.exports = router;
