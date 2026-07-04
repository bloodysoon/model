"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { modelSchema, type ModelFormData } from "@/lib/validations/model";

interface ModelFormProps {
  initialData?: Partial<ModelFormData>;
  onSubmit: (data: ModelFormData) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  showVideoField?: boolean;
}

export function ModelForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Create Model",
  showVideoField = true,
}: ModelFormProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ModelFormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      name: initialData?.name || "",
      avatarUrl: initialData?.avatarUrl || "",
      videoEmbedUrl: initialData?.videoEmbedUrl || "",
      description: initialData?.description || "",
    },
  });

  const handleSubmit = async (data: ModelFormData) => {
    try {
      setError(null);
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{submitLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Enter model name"
              disabled={isSubmitting}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <ImageUpload
              value={form.watch("avatarUrl")}
              onChange={(url) => form.setValue("avatarUrl", url)}
              disabled={isSubmitting}
            />
            {form.formState.errors.avatarUrl && (
              <p className="text-sm text-destructive">
                {form.formState.errors.avatarUrl.message}
              </p>
            )}
          </div>

          {showVideoField && (
            <div className="space-y-2">
              <Label htmlFor="videoEmbedUrl">Video Embed URL (Optional)</Label>
              <Input
                id="videoEmbedUrl"
                {...form.register("videoEmbedUrl")}
                placeholder="https://youtube.com/embed/..."
                disabled={isSubmitting}
              />
              {form.formState.errors.videoEmbedUrl && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.videoEmbedUrl.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Enter model description"
              rows={4}
              disabled={isSubmitting}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
