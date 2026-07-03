import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Video, Users, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

async function getStats() {
  try {
    const [modelCount, videoCount] = await Promise.all([
      prisma.model.count(),
      prisma.video.count()
    ])
    return { modelCount, videoCount }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return { modelCount: 0, videoCount: 0 }
  }
}

async function getRecentModels() {
  try {
    const models = await prisma.model.findMany({
      include: {
        _count: {
          select: { videos: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    })
    return models
  } catch (error) {
    console.error('Failed to fetch recent models:', error)
    return []
  }
}

export default async function HomePage() {
  const stats = await getStats()
  const recentModels = await getRecentModels()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Model Catalog</h1>
          <p className="text-xl text-muted-foreground mb-8">
            A modern platform to manage and browse models and their video content
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/models">
                <Users className="mr-2 h-5 w-5" />
                Browse Models
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/admin/models">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Admin Dashboard
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Total Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.modelCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Total Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.videoCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/models/new">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Add New Model
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {recentModels.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Recent Models</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentModels.map((model: any) => (
                <Card key={model.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Video className="h-4 w-4" />
                        <span>{model._count.videos} videos</span>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/models/${model.id}`}>
                          View <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/models">
                  View All Models <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
