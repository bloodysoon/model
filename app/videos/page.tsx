export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getVideos } from "@/lib/supabase/models";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Video } from "lucide-react";
import Link from "next/link";

export default async function VideosPage({
  searchParams,
}: {
  searchParams?: {
    model?: string;
    tag?: string;
  };
}) {
  const model = searchParams?.model ?? "";
  const tag = searchParams?.tag ?? "";

  const videos = await getVideos({ model, tag });

  const tags = Array.from(
    new Set(
      videos.flatMap((video: any) =>
        Array.isArray(video.tags) ? video.tags : [],
      ),
    ),
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <section className="mb-6 space-y-4">
          <form className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="ghost" size="sm" className="mb-3">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="model"
                defaultValue={model}
                placeholder="Search by model name..."
                className="h-10 pl-10"
              />
            </div>

            {tag ? <input type="hidden" name="tag" value={tag} /> : null}

            <Button type="submit">Search</Button>

            {(model || tag) && (
              <Button asChild variant="outline">
                <Link href="/videos">Clear</Link>
              </Button>
            )}
          </form>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((item: string) => {
                const active = item === tag;

                return (
                  <Button
                    key={item}
                    asChild
                    size="sm"
                    variant={active ? "default" : "outline"}
                  >
                    <Link
                      href={`/videos?${new URLSearchParams({
                        ...(model ? { model } : {}),
                        tag: item,
                      }).toString()}`}
                    >
                      #{item}
                    </Link>
                  </Button>
                );
              })}
            </div>
          )}
        </section>

        {videos.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-8 text-center">
              <Video className="h-6 w-6 text-muted-foreground" />
              <h3 className="font-medium">No videos found</h3>
              <p className="text-sm text-muted-foreground">
                Try another model name or tag.
              </p>
            </CardContent>
          </Card>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video: any) => (
              <Card key={video.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                    <iframe
                      src={video.url}
                      title="Video"
                      className="h-full w-full"
                      allowFullScreen
                    />
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/models/${video.modelId}`}
                        className="truncate text-sm font-medium hover:underline"
                      >
                        {video.Models?.name ?? "Unknown model"}
                      </Link>

                      {Array.isArray(video.tags) && video.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {video.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
