const XLSX = require('xlsx');
const Upload = require('../models/Upload');
const UserActivity = require('../models/UserActivity'); // Add this line

const uploadExcelFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read and parse the Excel file
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    // Save to Uploads collection
    const upload = new Upload({
      userId: req.user._id, // Make sure this is available via auth middleware
      filename: file.originalname,
      data: jsonData,
    });

    await upload.save();

    // ✅ Update UserActivity collection
    await UserActivity.findOneAndUpdate(
      { userId: req.user._id },
      {
        $push: {
          uploadedFiles: {
            fileName: file.originalname,
            uploadedAt: new Date(),
            fileUrl: `/uploads/${file.originalname}`, // Or your file path logic
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

module.exports = { uploadExcelFile };
