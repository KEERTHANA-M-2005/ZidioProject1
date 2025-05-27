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
  const { fileName } = req.body;
  const userId = req.user._id;

  try {
    const result = await UserActivity.updateOne(
      { userId, 'uploadedFiles.fileName': fileName },
      {
        $set: {
          'uploadedFiles.$.downloaded': true,
          'uploadedFiles.$.downloadAt': new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'File not found in activity' });
    }

    res.status(200).json({ message: 'Download activity recorded' });
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

module.exports = {
  trackChartGeneration,
  trackDownload,
  getUserActivity,
};
