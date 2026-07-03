import { getModels } from "@/lib/supabase/models"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Video } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function ModelsPage() {
  const models = await getModels()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/">
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                Back to Home
              </Link>
            </Button>
            <p className="text-muted-foreground">View all available models</p>
          </div>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Video className="h-4 w-4" />
                      <span>{model.Video?.length ?? 0} videos</span>
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
        )}
      </div>
    </div>
  )
}
