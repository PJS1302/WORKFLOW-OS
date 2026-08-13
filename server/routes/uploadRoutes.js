const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const File = require('../models/File');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

router.post('/', protect, upload.single('file'), asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Please upload a file' });
  }

  const fileDoc = await File.create({
    filename: req.file.originalname,
    path: `uploads/${req.file.filename}`,
    uploadedBy: req.user.id
  });

  res.status(200).json({
    success: true,
    data: fileDoc
  });
}));

module.exports = router;
