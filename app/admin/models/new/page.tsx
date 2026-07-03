import { prisma } from "@/lib/prisma"
import { ModelForm } from "@/components/models/model-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { type ModelFormData } from "@/lib/validations/model"

async function createModel(data: ModelFormData) {
  'use server'
  try {
    await prisma.model.create({
      data: {
        name: data.name,
        avatarUrl: data.avatarUrl,
        videoEmbedUrl: data.videoEmbedUrl || null,
        description: data.description,
      }
    })
  } catch (error) {
    console.error('Failed to create model:', error)
    throw new Error('Failed to create model')
  }
}

export default function NewModelPage() {
  async function handleSubmit(data: ModelFormData) {
    'use server'
    await createModel(data)
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
        <ModelForm onSubmit={handleSubmit} submitLabel="Create Model" />
      </div>
    </div>
  )
}
