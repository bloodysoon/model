import { supabase } from "./client";

export async function getModels() {
  const { data: models, error } = await supabase
    .from("Models")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !models) {
    console.error("Failed to fetch models:", error);
    return [];
  }

  const { data: videos, error: videosError } = await supabase
    .from("Video")
    .select("id, url, modelId")
    .order("id", { ascending: true });

  if (videosError) {
    console.error("Failed to fetch videos:", videosError);
  }

  return models.map((model) => ({
    ...model,
    Video: videos?.filter((video) => video.modelId === model.id) ?? [],
  }));
}

export async function getRecentModels(limit = 6) {
  const models = await getModels();
  return models.slice(0, limit);
}

export async function getModelById(id: number) {
  const { data: model, error } = await supabase
    .from("Models")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !model) {
    console.error("model error:", error);
    return null;
  }

  const { data: videos, error: videosError } = await supabase
    .from("Video")
    .select("id, url, modelId")
    .eq("modelId", id)
    .order("id", { ascending: true });

  if (videosError) {
    console.error("videos error:", videosError);
  }

  return {
    ...model,
    Video: videos ?? [],
  };
}

export async function getStats() {
  const [{ count: modelCount }, { count: videoCount }] = await Promise.all([
    supabase.from("Models").select("*", { count: "exact", head: true }),
    supabase.from("Video").select("*", { count: "exact", head: true }),
  ]);

  return {
    modelCount: modelCount ?? 0,
    videoCount: videoCount ?? 0,
  };
}

export async function createModel(data: { name: string; avatarUrl: string }) {
  const { data: model, error } = await supabase
    .from("Models")
    .insert({
      name: data.name,
      avatarUrl: data.avatarUrl,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create model:", error);
    throw error;
  }

  return model;
}

export async function updateModel(
  id: number,
  data: {
    name: string;
    avatarUrl: string;
  },
) {
  const { error } = await supabase
    .from("Models")
    .update({
      name: data.name,
      avatarUrl: data.avatarUrl,
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update model:", error);
    throw error;
  }
}

export async function deleteModel(id: number) {
  const { error } = await supabase.from("Models").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete model:", error);
    return { success: false, error: "Failed to delete model" };
  }

  return { success: true };
}

export async function createVideo(data: { modelId: number; url: string }) {
  const { error } = await supabase.from("Video").insert({
    modelId: data.modelId,
    url: data.url,
  });

  if (error) {
    console.error("Failed to create video:", error);
    throw error;
  }
}
