const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadExcelFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', protect, upload.single('file'), uploadExcelFile);

module.exports = router;
