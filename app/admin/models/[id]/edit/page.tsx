export const dynamic = "force-dynamic";
export const revalidate = 0;

import { revalidatePath } from "next/cache";
import {
  createVideo,
  deleteVideo,
  getModelById,
  updateModel,
  updateVideo,
} from "@/lib/supabase/models";
import {
  AVAILABLE_MODEL_TAGS,
  normalizeModelTags,
  type ModelTag,
} from "@/lib/model-tags";
import { ModelForm } from "@/components/models/model-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Save, Trash2, Video } from "lucide-react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { type ModelFormData } from "@/lib/validations/model";

function extractVideoTags(formData: FormData): ModelTag[] {
  return normalizeModelTags(formData.getAll("tags"));
}

function VideoTagFields({ selectedTags }: { selectedTags: ModelTag[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {AVAILABLE_MODEL_TAGS.map((tag) => {
        const checked = selectedTags.includes(tag);

        return (
          <label
            key={tag}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <input
              type="checkbox"
              name="tags"
              value={tag}
              defaultChecked={checked}
              className="h-4 w-4 rounded border-border"
            />
            {tag}
          </label>
        );
      })}
    </div>
  );
}

export default async function EditModelPage({
  params,
}: {
  params: { id: string };
}) {
  const modelId = Number(params.id);
  const model = await getModelById(modelId);

  if (!model) notFound();

  const editPath = `/admin/models/${modelId}/edit`;

  async function handleModelSubmit(data: ModelFormData) {
    "use server";

    await updateModel(modelId, {
      name: data.name,
      avatarUrl: data.avatarUrl,
      description: data.description,
    });

    revalidatePath(editPath);
    redirect(editPath);
  }

  async function handleCreateVideo(formData: FormData) {
    "use server";

    const url = String(formData.get("url") ?? "").trim();

    if (!url) {
      return;
    }

    await createVideo({
      modelId,
      url,
      tags: extractVideoTags(formData),
    });

    revalidatePath(editPath);
    redirect(editPath);
  }

  async function handleUpdateVideo(formData: FormData) {
    "use server";

    const videoId = Number(formData.get("videoId"));
    const url = String(formData.get("url") ?? "").trim();

    if (!videoId || !url) {
      return;
    }

    await updateVideo(videoId, {
      url,
      tags: extractVideoTags(formData),
    });

    revalidatePath(editPath);
    redirect(editPath);
  }

  async function handleDeleteVideo(formData: FormData) {
    "use server";

    const videoId = Number(formData.get("videoId"));

    if (!videoId) {
      return;
    }

    await deleteVideo(videoId);

    revalidatePath(editPath);
    redirect(editPath);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/admin/models">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Models
          </Link>
        </Button>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <div className="space-y-6">
            <ModelForm
              initialData={{
                name: model.name,
                avatarUrl: model.avatarUrl,
                description: model.description ?? "",
              }}
              onSubmit={handleModelSubmit}
              submitLabel="Update Model"
              showVideoField={false}
            />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Plus className="h-5 w-5" />
                  Add Video
                </CardTitle>
                <CardDescription>
                  Add a new video and set its individual tags.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={handleCreateVideo} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-video-url">Video URL</Label>
                    <Input
                      id="new-video-url"
                      name="url"
                      placeholder="https://youtube.com/embed/..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <VideoTagFields selectedTags={[]} />
                  </div>

                  <Button type="submit" className="w-full">
                    Add Video
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Video cards
              </h2>
              <p className="text-sm text-muted-foreground">
                Each video has its own URL, tags, save action and delete action.
              </p>
            </div>

            {model.Video?.length ? (
              <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
                {model.Video.map((video: any) => {
                  const videoTags = normalizeModelTags(video.tags);

                  return (
                    <Card key={video.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <iframe
                          src={video.url}
                          className="h-full w-full"
                          allowFullScreen
                          title={`Video ${video.id}`}
                        />
                      </div>

                      <CardContent className="space-y-4 p-5">
                        <form action={handleUpdateVideo} className="space-y-4">
                          <input type="hidden" name="videoId" value={video.id} />

                          <div className="space-y-2">
                            <Label htmlFor={`video-url-${video.id}`}>Video URL</Label>
                            <Input
                              id={`video-url-${video.id}`}
                              name="url"
                              defaultValue={video.url}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Tags</Label>
                            <VideoTagFields selectedTags={videoTags} />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button type="submit" size="sm">
                              <Save className="mr-2 h-4 w-4" />
                              Save
                            </Button>
                          </div>
                        </form>

                        <form action={handleDeleteVideo}>
                          <input type="hidden" name="videoId" value={video.id} />
                          <Button type="submit" variant="destructive" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Video className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">No videos yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Add the first video from the panel on the left.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
