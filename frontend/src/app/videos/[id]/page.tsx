import VideoPlayer from "@/components/video-player";
import { getVideoById, videoApi } from "@/lib/data";
import { notFound } from "next/navigation";

interface VideoPageProps {
  params: {
    id: string;
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  // Ensure params is properly awaited
  const { id } = await Promise.resolve(params);

  try {
    const video = await videoApi.getVideoById(id);

    if (!video) {
      notFound();
    }

    return (
      <main className="container py-8 space-y-6">
        <VideoPlayer src={video.videourl} title={video.title} videoId={video._id} />

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{video.title}</h1>
          <p className="text-muted-foreground">{video.description}</p>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching video:", error);
    notFound();
  }
}
