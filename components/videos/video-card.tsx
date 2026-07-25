import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface VideoCardProps {
  video: {
    id: number;
    url: string;
    modelId: number;
    tags: string[];
    Models?: {
      id: number;
      name: string;
      avatarUrl: string;
    };
  };
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <div className="aspect-video overflow-hidden rounded-lg bg-muted">
          <iframe
            src={video.url}
            title="Video"
            className="h-full w-full"
            allowFullScreen
            loading="lazy"
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
  );
}
