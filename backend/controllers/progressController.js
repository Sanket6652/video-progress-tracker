const Progress = require("../models/progress");

function mergeIntervals(intervals) {
  if (!Array.isArray(intervals) || intervals.length === 0) return [];

  // Sort by start time
  intervals.sort((a, b) => a.start - b.start);

  const merged = [];
  let current = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i];

    // If overlapping or touching
    if (next.start <= current.end + 0.1) {
      current.end = Math.max(current.end, next.end);
    } else {
      merged.push(current);
      current = next;
    }
  }

  merged.push(current);
  return merged;
}


const updateProgress = async (req, res) => {
  const { userId, videoId, interval, lastWatchedTime, videoDuration } = req.body;

  if (
    !userId || !videoId || !interval || typeof videoDuration !== "number" ||
    typeof interval.start !== "number" || typeof interval.end !== "number" ||
    interval.start < 0 || interval.end <= interval.start || interval.end > videoDuration
  ) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    let progress = await Progress.findOne({ userId, videoId });

    if (!progress) {
      progress = new Progress({
        userId,
        videoId,
        videoDuration,
        mergedIntervals: [interval],
        lastWatchedTime: lastWatchedTime || interval.end,
      });
    } else {
      progress.mergedIntervals.push(interval);
      progress.mergedIntervals = mergeIntervals(progress.mergedIntervals);

      if (typeof lastWatchedTime === "number") {
        progress.lastWatchedTime = Math.max(progress.lastWatchedTime, lastWatchedTime);
      }
    }

    await progress.save();

    const totalWatched = progress.mergedIntervals.reduce((acc, { start, end }) => acc + (end - start), 0);
    const percentage = Math.min(100, (totalWatched / progress.videoDuration) * 100).toFixed(2);

    res.json({
      message: "Progress updated",
      percentage: parseFloat(percentage),
      lastWatchedTime: progress.lastWatchedTime,
      mergedIntervals: progress.mergedIntervals,
    });
  } catch (err) {
    console.error("Error updating progress:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getProgress = async (req, res) => {
  const { userId, videoId } = req.params;

  try {
    const progress = await Progress.findOne({ userId, videoId });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    const totalWatched = progress.mergedIntervals.reduce((acc, { start, end }) => acc + (end - start), 0);
    const percentage = Math.min(100, (totalWatched / progress.videoDuration) * 100).toFixed(2);

    res.json({
      percentage: parseFloat(percentage),
      lastWatchedTime: progress.lastWatchedTime,
      mergedIntervals: progress.mergedIntervals,
      duration: progress.videoDuration,
    });
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateProgress, getProgress };
