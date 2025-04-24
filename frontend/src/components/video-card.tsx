"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"
import type { Video } from "@/lib/data"

interface VideoCardProps {
  video: Video
}

export function VideoCard({ video }: VideoCardProps) {
  const [progress, setProgress] = useState(0)
  //  console.log(video._id)
  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`video-progress-${video._id}`)
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        const percentage = parsed.percentage || 0
        setProgress(percentage)
      } catch (error) {
        console.error("Error parsing saved progress", error)
      }
    }
  }, [video._id])

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  function getVideoThumbnail(videourl: string): string | import("next/dist/shared/lib/get-img-props").StaticImport {
    if (!videourl) return "/placeholder.svg"

    // Handle YouTube URLs
    if (videourl.includes("youtube.com") || videourl.includes("youtu.be")) {
      const videoId = videourl.includes("youtube.com") 
        ? videourl.split("v=")[1]?.split("&")[0]
        : videourl.split("youtu.be/")[1]?.split("?")[0]
      
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      }
    }

    // Handle Vimeo URLs
    if (videourl.includes("vimeo.com")) {
      const videoId = videourl.split("vimeo.com/")[1]?.split("?")[0]
      if (videoId) {
        return `https://vimeo.com/api/v2/video/${videoId}/thumbnail_large.jpg`
      }
    }

    return "/placeholder.svg"
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link
        href={`/videos/${video._id}`}
        className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="relative aspect-video">
          <Image
            src={getVideoThumbnail(video.videourl) || video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(video.duration)}
          </div>
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0">
              <Progress value={progress} className="h-1 rounded-none" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium line-clamp-2">{video.title}</h3>
          
          {progress > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {progress < 100 ? `${Math.round(progress)}% completed` : "Completed"}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}
