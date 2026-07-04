export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getRecentModels } from "@/lib/supabase/models";
import { ModelSearch } from "@/components/models/model-search";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, LayoutDashboard, Plus, Film } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const search = searchParams?.q?.trim() ?? "";
  const recentModels = await getRecentModels(50, search);

  return (
    <main className="min-h-screen bg-background">
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Models
            </h1>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <ModelSearch />

            <Button asChild variant="outline" size="sm">
              <Link href="/videos">
                <Film className="mr-2 h-4 w-4" />
                Videos
              </Link>
            </Button>

            {/* <Button asChild variant="outline" size="sm">
              <Link href="/admin/models">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>

            <Button asChild variant="secondary" size="sm">
              <Link href="/admin/models/new">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Link>
            </Button> */}
          </div>
        </section>

        {recentModels.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-8 text-center">
              <Video className="h-6 w-6 text-muted-foreground" />
              <h3 className="font-medium">
                {search ? "No models found" : "No models yet"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Try another search query."
                  : "Create your first model."}
              </p>
            </CardContent>
          </Card>
        ) : (
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
        )}
      </div>
    </main>
  );
}
