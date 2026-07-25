export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getVideos } from "@/lib/supabase/models";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Video, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { VideoCard } from "@/components/videos/video-card";

export default async function VideosPage({
  searchParams,
}: {
  searchParams?: {
    model?: string;
    tag?: string;
    page?: string;
  };
}) {
  const model = searchParams?.model ?? "";
  const tag = searchParams?.tag ?? "";
  const page = parseInt(searchParams?.page ?? "1", 10);
  const perPage = 20;

  const { videos, totalCount, totalPages } = await getVideos({ 
    model, 
    tag, 
    page, 
    perPage 
  });

  // Get all tags from current page for display
  const tags = Array.from(
    new Set(
      videos.flatMap((video: any) =>
        Array.isArray(video.tags) ? video.tags : [],
      ),
    ),
  );

  // Helper function to build URL with preserved parameters
  function buildPageUrl(newPage: number) {
    const params = new URLSearchParams();
    if (model) params.set("model", model);
    if (tag) params.set("tag", tag);
    params.set("page", newPage.toString());
    return `/videos?${params.toString()}`;
  }

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
            <input type="hidden" name="page" value="1" />

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
                        page: "1",
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
          <>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((video: any) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </section>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalCount)} of {totalCount} videos
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                  >
                    <Link href={buildPageUrl(page - 1)}>
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Previous
                    </Link>
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          asChild
                          variant={pageNum === page ? "default" : "outline"}
                          size="sm"
                        >
                          <Link href={buildPageUrl(pageNum)}>
                            {pageNum}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                  >
                    <Link href={buildPageUrl(page + 1)}>
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
