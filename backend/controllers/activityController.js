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
  const { fileName, chartType, imageUrl } = req.body;
  const userId = req.user._id;

  try {
    // Optional: update downloaded status in uploadedFiles
    await UserActivity.updateOne(
      { userId, 'uploadedFiles.fileName': fileName },
      {
        $set: {
          'uploadedFiles.$.downloaded': true,
          'uploadedFiles.$.downloadAt': new Date(),
        },
      }
    );

    // Push to savedCharts so it appears in frontend
    await UserActivity.findOneAndUpdate(
      { userId },
      {
        $push: {
          savedCharts: {
            chartType: chartType || 'Unknown Chart',
            excelFileName: fileName,
            imageUrl: imageUrl || '',
            generatedAt: new Date(),
          },
        },
      },
      { upsert: true }
    );

    res.status(200).json({ message: 'Download tracked and chart saved' });
  } catch (error) {
    console.error('Download tracking error:', error);
    res.status(500).json({ message: 'Server error while tracking download' });
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

module.exports = {
  trackChartGeneration,
  trackDownload,
  getUserActivity,
  getUserActivityForAdmin, // <-- export the new admin function
};


