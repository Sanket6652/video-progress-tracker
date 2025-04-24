import { useCallback, useEffect, useState } from "react";
import axios from "axios";

interface Interval {
  start: number;
  end: number;
}

export function useVideoProgress(videoId: string, videoDuration: number) {
  const userId = "680a07c23f297e1f4d0f5a58";
  console.log(videoDuration);
  const [watchedIntervals, setWatchedIntervals] = useState<Interval[]>([]);
  const [lastPosition, setLastPosition] = useState<number>(0);

  const [watchedPercentage, setWatchedPercentage] = useState<number>(0);

  // Fetch existing progress from the backend
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/progress/${userId}/${encodeURIComponent(
            videoId
          )}`
        );
        setWatchedIntervals(res.data.mergedIntervals || []);
        setLastPosition(res.data.lastWatchedTime || 0);

        setWatchedPercentage(res.data.percentage || 0);
      } catch (err) {
        console.warn("Progress not found or error fetching:", err);
      }
    };

    fetchProgress();
  }, [videoId, userId]);

  // Call this when an interval is completed
  const addWatchedInterval = useCallback(
    async (start: number, end: number) => {
      try {
        const res = await axios.post("http://localhost:5000/progress/update", {
          userId,
          videoId,
          interval: { start, end },
          lastWatchedTime: end,
          videoDuration: videoDuration,
        });

        setWatchedIntervals(res.data.mergedIntervals || []);
        setLastPosition(res.data.lastWatchedTime || 0);
        setWatchedPercentage(res.data.percentage || 0);
      } catch (err) {
        console.error("Failed to update progress:", err);
      }
    },
    [videoId, videoDuration, userId]
  );

  const resetProgress = useCallback(async () => {
    try {
      await axios.delete(
        `http://localhost:5000/progress/${userId}/${encodeURIComponent(
          videoId
        )}`
      );
      setWatchedIntervals([]);
      setLastPosition(0);
      setWatchedPercentage(0);
    } catch (err) {
      console.error("Failed to reset progress:", err);
    }
  }, [videoId, userId]);

  return {
    watchedIntervals,
    lastPosition,
    watchedPercentage,
    addWatchedInterval,
    resetProgress,
  };
}
