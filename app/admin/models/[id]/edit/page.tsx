import { createVideo, getModelById, updateModel } from "@/lib/supabase/models"
import { ModelForm } from "@/components/models/model-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { type ModelFormData } from "@/lib/validations/model"

export default async function EditModelPage({
  params,
}: {
  params: { id: string }
}) {
  const modelId = Number(params.id)
  const model = await getModelById(modelId)

  if (!model) notFound()

  async function handleSubmit(data: ModelFormData) {
    "use server"

    await updateModel(modelId, {
      name: data.name,
      avatarUrl: data.avatarUrl,
    })

    if (data.videoEmbedUrl) {
      await createVideo({
        modelId,
        url: data.videoEmbedUrl,
      })
    }

    redirect("/admin/models")
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

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Current videos</h2>

          {model.Video?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {model.Video.map((video: any) => (
                <div key={video.id} className="overflow-hidden rounded-lg border bg-muted">
                  <iframe
                    src={video.url}
                    className="aspect-video w-full"
                    allowFullScreen
                    title="Video"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No videos yet.</p>
          )}
        </div>

        <ModelForm
          initialData={{
            name: model.name,
            avatarUrl: model.avatarUrl,
            videoEmbedUrl: "",
          }}
          onSubmit={handleSubmit}
          submitLabel="Update Model"
        />
      </div>
    </div>
  )
}