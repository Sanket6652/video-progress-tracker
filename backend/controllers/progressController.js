const Progress = require("../models/progress");

function mergeIntervals(intervals) {
  if (!Array.isArray(intervals) || intervals.length === 0) return [];

  intervals.sort((a, b) => a.start - b.start);

  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = intervals[i];

    if (curr.start <= prev.end) {
      // Merge overlapping/contiguous
      prev.end = Math.max(prev.end, curr.end);
    } else {
      merged.push(curr);
    }
  }

  return merged;
}

const updateProgress = async (req, res) => {
  const { userId, videoId, interval, lastWatchedTime, videoDuration } =
    req.body;

  if (
    !userId ||
    !videoId ||
    !interval ||
    interval.start == null ||
    interval.end == null ||
    typeof videoDuration !== "number"
  ) {
    return res.status(400).json({ message: "Invalid data" });
  }

  // Validate interval
  if (
    typeof interval.start !== "number" ||
    typeof interval.end !== "number" ||
    interval.start < 0 ||
    interval.end <= interval.start ||
    interval.end > videoDuration
  ) {
    return res.status(400).json({ message: "Invalid interval timing" });
  }

  try {
    let progress = await Progress.findOne({ userId, videoId });

    if (!progress) {
      progress = new Progress({
        userId,
        videoId,
        videoDuration,
        intervals: [interval],
        lastWatchedTime,
      });
    } else {
      if (!Array.isArray(progress.intervals)) progress.intervals = [];

      progress.intervals.push(interval);
      progress.intervals = mergeIntervals(progress.intervals);

      if (
        typeof lastWatchedTime === "number" &&
        (typeof progress.lastWatchedTime !== "number" ||
          lastWatchedTime > progress.lastWatchedTime)
      ) {
        progress.lastWatchedTime = lastWatchedTime;
      }
    }

    await progress.save();

    const totalWatchedSeconds = progress.intervals.reduce(
      (acc, curr) => acc + (curr.end - curr.start),
      0
    );

    const percentage = Math.min(
      100,
      (totalWatchedSeconds / videoDuration) * 100
    ).toFixed(2);

    return res.json({
      message: "Progress updated",
      percentage: parseFloat(percentage),
      lastWatchedTime: progress.lastWatchedTime,
      mergedIntervals: progress.intervals,
    });
  } catch (err) {
    console.error("Progress update error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getProgress = async (req, res) => {
  const { userId, videoId } = req.params;
console.log(userId,videoId)
  try {
    const progress = await Progress.findOne({ userId, videoId });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    const totalWatchedSeconds = progress.intervals.reduce(
      (acc, curr) => acc + (curr.end - curr.start),
      0
    );
    const percentage = Math.min(
      100,
      (totalWatchedSeconds / progress.videoDuration) * 100
    ).toFixed(2);

    res.json({
      percentage: parseFloat(percentage),
      lastWatchedTime: progress.lastWatchedTime,
      mergedIntervals: progress.intervals,
      duration: progress.videoDuration,
    });
  } catch (err) {
    console.error("Progress fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { updateProgress, getProgress };
