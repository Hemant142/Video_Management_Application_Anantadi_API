const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  blacklist: {
    type: [String],
    default: [],
  },
}, { timestamps: true }); // Optional: adds createdAt and updatedAt

const BlacklistModel = mongoose.model("Blacklist", blacklistSchema);

module.exports = BlacklistModel;
