const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { authMiddleware } = require("../middleware/authMiddleware");
const { uploadVideo } = require("../controllers/videoController");
const { VideoModel } = require("../models/videoModel");

const videoRouter = express.Router();

// Ensure "uploads/" directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safeFilename}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

// Upload Video Route
videoRouter.post("/upload", authMiddleware, upload.single("video"), uploadVideo);

// Fetch User Videos Route
videoRouter.get("/my-videos", authMiddleware, async (req, res) => {
  try {
    const videos = await VideoModel.find({ user: req.user._id });

    if (!videos.length) {
      return res.status(404).json({ message: "No videos found for this user" });
    }

    // Return full URL for video
    const updatedVideos = videos.map(video => ({
      ...video._doc,
      videoUrl: `${req.protocol}://${req.get("host")}${video.videoUrl.startsWith("/") ? video.videoUrl : `/${video.videoUrl}`}`,
    }));
    

    res.status(200).json(updatedVideos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Error fetching videos" });
  }
});

// Fetch Video by ID
videoRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const video = await VideoModel.findById(req.params.id);
console.l
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Return full URL for the video
    const videoData = {
      ...video._doc,
      videoUrl: `${req.protocol}://${req.get("host")}${video.videoUrl.startsWith("/") ? video.videoUrl : `/${video.videoUrl}`}`,
    };

    res.status(200).json(videoData);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ error: "Error fetching video" });
  }
});


module.exports = { videoRouter };
