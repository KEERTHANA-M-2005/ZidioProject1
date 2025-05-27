// UserActivity.js (or embed this inside the User schema)
const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
  chartType: String,
  generatedAt: Date,
  excelFileName: String,
  imageUrl: String, // URL to saved chart image (optional)
});

const fileHistorySchema = new mongoose.Schema({
  fileName: String,
  uploadedAt: Date,
  fileUrl: String, // S3 or local path
  downloaded: Boolean,
  downloadAt: Date,
});

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedFiles: [fileHistorySchema],
  savedCharts: [chartSchema],
});

module.exports = mongoose.model('UserActivity', userActivitySchema);
