const UploadService = require('../models/upload.model');


exports.upload=async (req, res) => {
    try {
      const response = await UploadService.upload(req.file);
      res.json(response);
    } catch (err) {
      res.status(500).json({ message: err.message });
  }
}

exports.uploadVideo = async (req, res) => {
  try {
    const response = await UploadService.uploadMultipleVideo([req.file]); // Thay đổi ở đây
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
