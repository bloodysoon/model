export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getRecentModels, getStats } from "@/lib/supabase/models";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Video,
  Users,
  LayoutDashboard,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const stats = await getStats();
  const recentModels = await getRecentModels(6);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {/* Top bar */}
        <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Curated model & video catalog
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Models
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse models, open profiles, and preview their latest videos.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link href="/models">
                <Users className="mr-2 h-4 w-4" />
                Browse models
              </Link>
            </Button>

            <Button asChild variant="outline" size="sm">
              <Link href="/admin/models">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>

            <Button asChild variant="secondary" size="sm">
              <Link href="/admin/models/new">
                <Plus className="mr-2 h-4 w-4" />
                Add model
              </Link>
            </Button>
          </div>
        </section>

        {/* Stats row */}
        <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            label="Models"
            value={stats.modelCount}
            icon={<Users className="h-4 w-4" />}
          />
          <StatTile
            label="Videos"
            value={stats.videoCount}
            icon={<Video className="h-4 w-4" />}
          />
          <Card className="col-span-2 overflow-hidden lg:col-span-2">
            <CardContent className="flex h-full items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">Keep the catalog updated</p>
                <p className="text-sm text-muted-foreground">
                  Add a new model or enrich an existing one with more videos.
                </p>
              </div>

              <Button asChild size="sm" className="shrink-0">
                <Link href="/admin/models/new">
                  Create
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Models grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Recent models
              </h2>
              <p className="text-sm text-muted-foreground">
                Compact overview with quick video previews.
              </p>
            </div>

            <Button asChild variant="ghost" size="sm">
              <Link href="/models">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {recentModels.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Video className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">No models yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Create your first model to start building the catalog.
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link href="/admin/models/new">Add model</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {recentModels.map((model: any) => {
                const videos = model.Video ?? [];

                return (
                  <Card
                    key={model.id}
                    className="group overflow-hidden border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row">
                        {/* Left: avatar */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted lg:w-[220px] lg:flex-shrink-0">
                          <Image
                            src={model.avatarUrl}
                            alt={model.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 1024px) 100vw, 220px"
                          />
                        </div>

                        {/* Right: content */}
                        <div className="flex min-w-0 flex-1 flex-col p-4">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate text-base font-semibold">
                                {model.name}
                              </h3>
                              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                  <Video className="h-3.5 w-3.5" />
                                  {videos.length} videos
                                </span>
                              </div>
                            </div>

                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="shrink-0"
                            >
                              <Link href={`/models/${model.id}`}>Open</Link>
                            </Button>
                          </div>

                          {videos.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                              {videos.slice(0, 2).map((video: any) => (
                                <div
                                  key={video.id}
                                  className="overflow-hidden rounded-lg border bg-muted"
                                >
                                  <iframe
                                    src={video.url}
                                    title={video.title ?? "Video"}
                                    className="aspect-video w-full"
                                    allowFullScreen
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex h-full min-h-[110px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                              No videos yet
                            </div>
                          )}

                          {videos.length > 2 && (
                            <div className="mt-3 text-xs text-muted-foreground">
                              +{videos.length - 2} more videos
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        </div>

        <div className="rounded-xl border bg-muted/60 p-2.5 text-muted-foreground">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
