"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useVideoProgress } from "@/hooks/useVideoProgress";

interface VideoPlayerProps {
  src: string;
  title: string;
  videoId: string;
}

export default function VideoPlayer({ src, title, videoId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  console.log(duration);
  const {
    watchedPercentage,
    addWatchedInterval,
    resetProgress,
    lastPosition,
    watchedIntervals,
  } = useVideoProgress(videoId, duration);

  // Track when video is playing to record intervals
  const [startInterval, setStartInterval] = useState<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial duration when metadata is loaded
    const handleLoadedMetadata = () => {
      setDuration(video.duration);

      // Set video to last position if available
      if (lastPosition > 0) {
        video.currentTime = lastPosition;
      }
    };

    // Update current time as video plays
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    // When video ends
    const handleEnded = () => {
      setIsPlaying(false);
      if (startInterval !== null) {
        addWatchedInterval(startInterval, video.duration);
        setStartInterval(null);
      }
    };

    // When video is paused
    const handlePause = () => {
      if (startInterval !== null) {
        addWatchedInterval(startInterval, video.currentTime);
        setStartInterval(null);
      }
    };

    // When video is played
    const handlePlay = () => {
      setStartInterval(video.currentTime);
    };

    // When user seeks in the video
    const handleSeeking = () => {
      if (startInterval !== null) {
        addWatchedInterval(startInterval, video.currentTime);
        setStartInterval(null);
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("pause", handlePause);
    video.addEventListener("play", handlePlay);
    video.addEventListener("seeking", handleSeeking);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("seeking", handleSeeking);
    };
  }, [addWatchedInterval, lastPosition, startInterval]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    resetProgress();
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      setCurrentTime(0);
      video.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Generate progress bar segments to visualize watched intervals
  const generateProgressSegments = () => {
    if (!duration) return null;

    return watchedIntervals.map((interval, index) => {
      const startPercent = (interval.start / duration) * 100;
      const widthPercent = ((interval.end - interval.start) / duration) * 100;

      return (
        <div
          key={index}
          className="absolute h-full bg-green-500"
          style={{
            left: `${startPercent}%`,
            width: `${widthPercent}%`,
          }}
        />
      );
    });
  };
  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const newTime = percentage * duration;

    // Update video time
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressBarKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    const video = videoRef.current;
    if (!video) return;

    const STEP = 5; // 5 seconds step

    switch (event.key) {
      case "ArrowLeft":
        video.currentTime = Math.max(0, currentTime - STEP);
        break;
      case "ArrowRight":
        video.currentTime = Math.min(duration, currentTime + STEP);
        break;
    }
  };
  return (
    <div className="flex flex-col w-full bg-card rounded-lg overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        className="w-full aspect-video bg-black"
        onClick={togglePlay}
        playsInline
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              aria-label="Reset progress"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Progress: {Math.round(watchedPercentage)}%
            </span>
          </div>
        </div>

        {/* Custom progress bar showing watched segments */}
        <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-4">
          {generateProgressSegments()}

          {/* Current position indicator */}
          <div
            className="absolute h-full w-1 bg-primary"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Overall progress bar */}
        <div
          className="cursor-pointer"
          onClick={handleProgressBarClick}
          onKeyDown={handleProgressBarKeyDown}
          role="slider"
          aria-label="Overall progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={watchedPercentage}
          tabIndex={0}
        >
          <Progress value={watchedPercentage} className="h-2" />
        </div>
      </div>
    </div>
  );
}
