const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadExcelFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// Store the file in memory (not in disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to upload Excel file
router.post('/', protect, upload.single('file'), uploadExcelFile);

module.exports = router;
