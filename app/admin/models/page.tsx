import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Video, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"

async function getModels() {
  try {
    const models = await prisma.model.findMany({
      include: {
        _count: {
          select: { videos: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return models
  } catch (error) {
    console.error('Failed to fetch models:', error)
    return []
  }
}

async function deleteModel(id: string) {
  'use server'
  try {
    await prisma.model.delete({
      where: { id }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to delete model:', error)
    return { success: false, error: 'Failed to delete model' }
  }
}

export default async function AdminModelsPage() {
  const models = await getModels()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button asChild variant="ghost" className="mb-4">
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
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No models yet</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first model</p>
              <Button asChild>
                <Link href="/admin/models/new">Create Model</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model: any) => (
              <Card key={model.id} className="overflow-hidden">
                <div className="relative h-48 w-full bg-muted">
                  <Image
                    src={model.avatarUrl}
                    alt={model.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{model.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {model.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      <span>{model._count.videos} videos</span>
                    </div>
                    <span>Added {format(new Date(model.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/admin/models/${model.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server'
                      await deleteModel(model.id)
                    }}>
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
