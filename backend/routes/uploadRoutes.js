const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadExcelFile, getUploadHistory } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// Setup multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to upload Excel file
router.post('/', protect, upload.single('file'), uploadExcelFile);

// GET route to get upload history for logged-in user
router.get('/history', protect, getUploadHistory);

module.exports = router;
