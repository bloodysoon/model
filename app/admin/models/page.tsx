export const dynamic = "force-dynamic"
export const revalidate = 0

import { getModels, deleteModel } from "@/lib/supabase/models"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Video, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { revalidatePath } from "next/cache"

export default async function AdminModelsPage() {
  const models = await getModels()

  async function handleDelete(id: number) {
    "use server"
    await deleteModel(id)
    revalidatePath("/admin/models")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button asChild variant="ghost" className="mb-2">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-4xl font-bold mb-2">Manage Models</h1>
            <p className="text-muted-foreground">Create, edit, and delete models</p>
          </div>
          <Button asChild>
            <Link href="/admin/models/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Model
            </Link>
          </Button>
        </div>

        {models.length === 0 ? (
          <Card className="w-full">
            <CardContent className="py-8 text-center">
              <Video className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-base font-semibold mb-2">No models yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Get started by creating your first model</p>
              <Button asChild>
                <Link href="/admin/models/new">Create Model</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {models.map((model: any) => (
              <Card key={model.id} className="overflow-hidden">
                <div className="relative aspect-[3/4] w-full bg-muted">
                  <Image
                    src={model.avatarUrl}
                    alt={model.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Video className="h-3.5 w-3.5" />
                      <span>{model.Video?.length ?? 0} videos</span>
                    </div>
                    <span>
                      Added {format(new Date(model.created_at), "MMM d, yyyy")}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1" size="sm">
                      <Link href={`/admin/models/${model.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>

                    <form
                      action={async () => {
                        "use server"
                        await handleDelete(model.id)
                      }}
                    >
                      <Button type="submit" variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}