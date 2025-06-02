// controllers/downloadController.js
const Download = require("../models/downloadModel");

const getDownloadHistory = async (req, res) => {
  try {
    const downloads = await Download.find({ userId: req.params.userId });
    res.json(downloads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch download history" });
  }
};
