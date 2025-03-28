const { VideoModel } = require("../models/videoModel");
const path = require("path");

// Upload Video Controller
const uploadVideo = async (req, res) => {
  try {
    const { title, description, tags, duration } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No video file uploaded" });
    }

    const videoUrl = `/uploads/${file.filename}`;
    const newVideo = new VideoModel({
      user: req.user._id, // Assuming authMiddleware sets req.user
      title,
      description,
      tags: tags ? tags.split(",") : [],
      fileSize: (file.size / (1024 * 1024)).toFixed(2), // Convert to MB
      videoUrl,
      duration,
    });

    await newVideo.save();
    res.status(201).json({ message: "Video uploaded successfully", video: newVideo });
  } catch (err) {
    console.error("Error uploading video:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { uploadVideo };
