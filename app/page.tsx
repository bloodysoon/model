export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getRecentModels } from "@/lib/supabase/models";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, LayoutDashboard, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const recentModels = await getRecentModels(20);

  return (
    <main className="min-h-screen bg-background">
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        {/* Header */}
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Recent models
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse models and open their galleries.
            </p>
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
          <section>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {recentModels.map((model: any) => {
                const videos = model.Video ?? [];

                return (
                  <Card
                    key={model.id}
                    className="group overflow-hidden border-border/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <CardContent className="p-0">
                      <Link href={`/models/${model.id}`} className="block">
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                          <Image
                            src={model.avatarUrl}
                            alt={model.name}
                            fill
                            quality={100}
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                          />
                        </div>
                      </Link>

                      <div className="flex min-w-0 items-center justify-between gap-3 p-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold sm:text-base">
                            {model.name}
                          </h3>

                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Video className="h-3.5 w-3.5" />
                            {videos.length} videos
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
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
