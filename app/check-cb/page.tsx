"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { checkModelsAction, ModelWithStatus } from "./actions";

export default function CheckCBPage() {
  const [models, setModels] = useState<ModelWithStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkModels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const modelsWithStatus = await checkModelsAction();
      setModels(modelsWithStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check models');
      console.error('Error checking models:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkModels();
  }, []);

  const toggleVideo = (modelId: number) => {
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, showVideo: !model.showVideo }
        : model
    ));
  };

  const onlineModels = models.filter(m => m.isOnline);

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
          </div>
          <Button 
            onClick={checkModels} 
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Check Status
              </>
            )}
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="py-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {onlineModels.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
              {onlineModels.map((model) => (
                <Card key={model.id} className="overflow-hidden">
                  <div className="relative h-64 w-full bg-muted">
                    {model.showVideo ? (
                      <iframe
                        src={`https://chaturbate.com/embed/${model.name}/?join_overlay=1&campaign=GeOP2&embed_video_only=1&disable_sound=1&tour=9oGW&mobileRedirect=never&disable_autoplay=1`}
                        className="w-full h-full"
                        frameBorder="0"
                        scrolling="no"
                        allowFullScreen
                        title={`${model.name} Live Cam`}
                        loading="lazy"
                      />
                    ) : (
                      <Image
                        src={model.imageUrl || model.avatarUrl}
                        alt={model.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      onClick={() => toggleVideo(model.id)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      {model.showVideo ? (
                        <>
                          <Video className="mr-2 h-4 w-4" />
                          Show Image
                        </>
                      ) : (
                        <>
                          <Video className="mr-2 h-4 w-4" />
                          Watch Live
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {models.length > 0 && onlineModels.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <Video className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-base font-semibold mb-2">No models online</h3>
              <p className="text-sm text-muted-foreground">
                None of the checked models are currently online on Chaturbate
              </p>
            </CardContent>
          </Card>
        )}

        {models.length === 0 && !loading && !error && (
          <Card>
            <CardContent className="py-8 text-center">
              <Video className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-base font-semibold mb-2">Ready to check</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click the "Check Status" button to see which models are online
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
