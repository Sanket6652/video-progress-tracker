const mongoose = require("mongoose");

const IntervalSchema = new mongoose.Schema({
  start: Number,
  end: Number,
});

const ProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  videoId: { type: String, required: true },
  videoDuration: { type: Number, required: true },
  mergedIntervals: [IntervalSchema],
  lastWatchedTime: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

ProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", ProgressSchema);
