import { prisma } from "@/lib/prisma"
import { ModelForm } from "@/components/models/model-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { type ModelFormData } from "@/lib/validations/model"
import { notFound } from "next/navigation"

async function getModel(id: string) {
  try {
    const model = await prisma.model.findUnique({
      where: { id }
    })
    return model
  } catch (error) {
    console.error('Failed to fetch model:', error)
    return null
  }
}

async function updateModel(id: string, data: ModelFormData) {
  'use server'
  try {
    await prisma.model.update({
      where: { id },
      data: {
        name: data.name,
        avatarUrl: data.avatarUrl,
        videoEmbedUrl: data.videoEmbedUrl || null,
        description: data.description,
      }
    })
  } catch (error) {
    console.error('Failed to update model:', error)
    throw new Error('Failed to update model')
  }
}

export default async function EditModelPage({ params }: { params: { id: string } }) {
  const model = await getModel(params.id)

  if (!model) {
    notFound()
  }

  async function handleSubmit(data: ModelFormData) {
    'use server'
    await updateModel(params.id, data)
    redirect('/admin/models')
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
        <ModelForm 
          initialData={{
            name: model.name,
            avatarUrl: model.avatarUrl,
            videoEmbedUrl: model.videoEmbedUrl || undefined,
            description: model.description,
          }}
          onSubmit={handleSubmit}
          submitLabel="Update Model"
        />
      </div>
    </div>
  )
}
