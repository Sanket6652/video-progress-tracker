import VideoPlayer from "@/components/video-player";
import { videoApi } from "@/lib/data";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const video = await videoApi.getVideoById(id);

  if (!video) {
    notFound();
  }

  return (
    <main className="container py-8 space-y-6">
      <VideoPlayer
        src={video.videourl}
        title={video.title}
        videoId={video._id}
      />

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        <p className="text-muted-foreground">{video.description}</p>
      </div>
    </main>
  );
}
