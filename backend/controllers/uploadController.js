const XLSX = require('xlsx');
const Upload = require('../models/Upload');

const uploadExcelFile = async (req, res) => {
  try {
    const file = req.file;
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const upload = new Upload({
      userId: req.user._id, // assuming JWT middleware adds this
      filename: file.originalname,
      data: data,
    });

    await upload.save();
    res.status(201).json({ message: 'File uploaded successfully', upload });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

module.exports = { uploadExcelFile };
