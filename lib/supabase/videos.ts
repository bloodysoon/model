import { supabase } from "./client"

export async function getVideosByModelId(modelId: string) {
  return supabase
    .from("videos")
    .select("*")
    .eq("modelId", modelId)
    .order("createdAt", { ascending: false })
}

export async function createVideo(data: {
  modelId: string
  title: string
  embedUrl: string
  thumbnailUrl?: string
}) {
  return supabase
    .from("videos")
    .insert(data)
    .select()
    .single()
}

export async function deleteVideo(id: string) {
  return supabase
    .from("videos")
    .delete()
    .eq("id", id)
}