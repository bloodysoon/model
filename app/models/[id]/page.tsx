export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getModelById } from "@/lib/supabase/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

export default async function ModelDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const model = await getModelById(Number(params.id));

  if (!model) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Model not found</h3>
            <p className="text-muted-foreground mb-4">
              The model you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/models">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Models
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const videos = model.Video ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Models
          </Link>
        </Button>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{model.name}</h1>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Video Gallery</h2>

          {videos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
                <p className="text-muted-foreground">
                  This model doesn't have any videos uploaded yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video: any) => (
                <Card key={video.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <iframe
                        src={video.url}
                        className="w-full h-full"
                        allowFullScreen
                        title={video.title ?? "Video"}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
