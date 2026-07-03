export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getRecentModels, getStats } from "@/lib/supabase/models";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, LayoutDashboard, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  await getStats();
  const recentModels = await getRecentModels(6);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        {/* Top bar */}
        <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Recent models
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
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

        {/* Models grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between"></div>

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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {recentModels.map((model: any) => {
                const videos = model.Video ?? [];

                return (
                  <Card
                    key={model.id}
                    className="group overflow-hidden border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <CardContent className="p-0">
                      <div className="flex h-full flex-col">
                        {/* Left: avatar */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                          <Image
                            src={model.avatarUrl}
                            alt={model.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
                          />
                        </div>

                        {/* Right: content */}
                        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="line-clamp-2 text-base font-semibold sm:text-lg">
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
