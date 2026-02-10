const UserActivity = require('../models/UserActivity');

// Track chart generation
const trackChartGeneration = async (req, res) => {
  const { chartType, excelFileName, imageUrl } = req.body;
  const userId = req.user._id;

  try {
    await UserActivity.findOneAndUpdate(
      { userId },
      {
        $push: {
          savedCharts: {
            chartType,
            generatedAt: new Date(),
            excelFileName,
            imageUrl,
          },
        },
      },
      { upsert: true }
    );

    res.status(200).json({ message: 'Chart activity recorded' });
  } catch (error) {
    console.error('Chart tracking error:', error);
    res.status(500).json({ message: 'Server error while tracking chart' });
  }
};

// Track file download
const trackDownload = async (req, res) => {
  console.log('Received download tracking request. Body:', req.body);
  const { excelFileName, chartType, imageUrl } = req.body;
  const userId = req.user._id;

  try {
    // Optional: update downloaded status in uploadedFiles
    // Note: This part seems to be intended for tracking downloads of original uploaded files, not charts.
    // We might need to clarify if this is necessary or if tracking savedCharts is sufficient.
    // await UserActivity.updateOne(
    //   { userId, 'uploadedFiles.fileName': fileName },
    //   {
    //     $set: {
    //       'uploadedFiles.$.downloaded': true,
    //       'uploadedFiles.$.downloadAt': new Date(),
    //     },
    //   }
    // );

    // Push to savedCharts so it appears in frontend
    const updateResult = await UserActivity.findOneAndUpdate(
      { userId },
      {
        $push: {
          savedCharts: {
            chartType: chartType || 'Unknown Chart',
            excelFileName: excelFileName || 'N/A',
            imageUrl: imageUrl || '',
            generatedAt: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    console.log('User activity updated. Result:', updateResult);
    res.status(200).json({ message: 'Download tracked and chart saved' });
  } catch (error) {
    console.error('Download tracking error:', error);
    res.status(500).json({ message: 'Server error while tracking download' });
  }
};

// Track generic visit or action (dashboard visit, login visit etc.)
const trackVisit = async (req, res) => {
  try {
    const userId = req.user._id;
    const { actionType, metadata } = req.body;

    await UserActivity.findOneAndUpdate(
      { userId },
      { $push: { visits: { actionType, metadata: metadata || {}, timestamp: new Date() } } },
      { upsert: true }
    );

    res.status(200).json({ message: 'Visit tracked' });
  } catch (err) {
    console.error('Track visit error:', err);
    res.status(500).json({ message: 'Failed to track visit' });
  }
};

// Get full user activity
const getUserActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const activity = await UserActivity.findOne({ userId });

    res.status(200).json(activity || { uploadedFiles: [], savedCharts: [] });
  } catch (error) {
    console.error('Activity fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch activity' });
  }
};
// Admin: Get activity of any user by userId param
const getUserActivityForAdmin = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID parameter is required" });
    }

    const activity = await UserActivity.findOne({ userId });

    if (!activity) {
      return res.status(404).json({ message: "No activity found for this user" });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error('Admin activity fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch user activity' });
  }
};

// Admin: Get all users' activities in flattened form
const getAllActivities = async (req, res) => {
  try {
    const activities = await UserActivity.find().populate('userId', 'name email');

    // Flatten into a consistent array of activity events
    const flattened = [];

    activities.forEach((act) => {
      const email = act.userId ? act.userId.email : 'Unknown';

      (act.uploadedFiles || []).forEach((f) => {
        flattened.push({
          email,
          action: 'upload',
          details: { fileName: f.fileName, fileUrl: f.fileUrl },
          timestamp: f.uploadedAt,
        });
      });

      (act.savedCharts || []).forEach((c) => {
        flattened.push({
          email,
          action: 'chart',
          details: { chartType: c.chartType, excelFileName: c.excelFileName, imageUrl: c.imageUrl },
          timestamp: c.generatedAt,
        });
      });
    });

    // Sort recent first
    flattened.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json(flattened);
  } catch (error) {
    console.error('Fetch all activities error:', error);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
};

module.exports = {
  trackChartGeneration,
  trackDownload,
  getUserActivity,
  getUserActivityForAdmin,
  getAllActivities,
  trackVisit,
};


