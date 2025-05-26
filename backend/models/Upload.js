const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  data: { type: Array, required: true }, // store parsed Excel rows
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Upload', uploadSchema);
