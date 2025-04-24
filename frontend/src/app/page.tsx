import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-col items-center justify-center flex-1 p-4 text-center bg-gradient-to-b from-background to-muted">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Learn at your own pace, track your real progress
          </h1>
          <p className="text-xl text-muted-foreground">
            Our intelligent video platform tracks what you've actually watched,
            not just what you've played.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/videos">Browse Videos</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
