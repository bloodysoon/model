import { supabase } from "./client"
import { supabaseAdmin } from "./server"

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
  return supabaseAdmin
    .from("videos")
    .insert(data)
    .select()
    .single()
}

export async function deleteVideo(id: string) {
  return supabaseAdmin
    .from("videos")
    .delete()
    .eq("id", id)
}