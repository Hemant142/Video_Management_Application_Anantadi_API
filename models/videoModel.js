const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  tags: [String],
  fileSize: String,
  videoUrl: String,
  duration: String,
  createdAt: { type: Date, default: Date.now },
});

const VideoModel = mongoose.model("Video", videoSchema);
module.exports = { VideoModel };
