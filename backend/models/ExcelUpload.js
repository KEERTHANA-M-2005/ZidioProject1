const mongoose = require('mongoose');

const ExcelUploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  data: { type: Object, required: true }, // Parsed Excel data as JSON
  uploadDate: { type: Date, default: Date.now },
  analysisHistory: [
    {
      chartType: String,
      xAxis: String,
      yAxis: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('ExcelUpload', ExcelUploadSchema);
