import { VideoGrid } from "@/components/video-grid";
import {  videoApi } from "@/lib/data";

export default async function VideosPage() {
  const videos = await videoApi.getVideos();

  return (
    <div className="container py-8 space-y-6 px-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Video Library</h1>
        <p className="text-muted-foreground">
          Browse our collection of educational videos with intelligent progress
          tracking
        </p>
      </div>
      <VideoGrid videos={videos} />
    </div>
  );
}
