const express = require('express');
const router = express.Router();
const {
  trackChartGeneration,
  trackDownload,
  getUserActivity,
} = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

router.post('/track-chart', protect, trackChartGeneration);
router.post('/track-download', protect, trackDownload);
router.get('/activity', protect, getUserActivity);

module.exports = router;
