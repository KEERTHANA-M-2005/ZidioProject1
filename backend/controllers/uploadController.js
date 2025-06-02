// controllers/uploadController.js
const XLSX = require('xlsx');
const Upload = require('../models/ExcelUpload');
const UserActivity = require('../models/UserActivity');

// ✅ Upload Excel File Handler (for users)
const uploadExcelFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse Excel file buffer
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    const rowCount = jsonData.length;
    const columnCount = rowCount > 0 ? Object.keys(jsonData[0]).length : 0;

    // Save upload document
    const upload = new Upload({
      userId: req.user._id,
      filename: file.originalname,
      data: jsonData,
      rowCount,
      columnCount,
    });

    await upload.save();

    // Track upload activity
    await UserActivity.findOneAndUpdate(
      { userId: req.user._id },
      {
        $push: {
          uploadedFiles: {
            fileName: file.originalname,
            uploadedAt: new Date(),
            fileUrl: `/uploads/${file.originalname}`,
            downloaded: false,
          },
        },
      },
      { upsert: true }
    );

    res.status(201).json({ message: 'File uploaded and activity tracked successfully', upload });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload', error: error.message });
  }
};

// ✅ User: Get own upload history
const getUploadHistory = async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user._id })
      .select('filename rowCount columnCount uploadedAt summary')
      .sort({ uploadedAt: -1 });

    res.json(uploads);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch upload history' });
  }
};

// ✅ Admin: Get upload history of a specific user by ID
const getUploadHistoryByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const uploads = await Upload.find({ userId: id })
      .select('filename rowCount columnCount uploadedAt summary')
      .sort({ uploadedAt: -1 });

    res.json(uploads);
  } catch (error) {
    console.error('Admin fetch user history error:', error);
    res.status(500).json({ message: 'Failed to fetch user upload history' });
  }
};

module.exports = {
  uploadExcelFile,
  getUploadHistory,
  getUploadHistoryByUserId,
};
