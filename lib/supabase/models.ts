import { supabase } from "./client";

function isMissingColumnError(error: unknown, column: string) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const message =
    "message" in error && typeof error.message === "string"
      ? error.message
      : "";

  return message.includes(column) && message.includes("schema cache");
}

export async function getModels() {
  const { data: models, error } = await supabase
    .from("Models")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !models) {
    console.error("Failed to fetch models:", error);
    return [];
  }

  let videos = null;
  let videosError = null;

  const videosWithTagsQuery = await supabase
    .from("Video")
    .select("id, url, modelId, tags")
    .order("id", { ascending: true });

  videos = videosWithTagsQuery.data;
  videosError = videosWithTagsQuery.error;

  if (videosError && isMissingColumnError(videosError, "tags")) {
    const fallbackVideosQuery = await supabase
      .from("Video")
      .select("id, url, modelId")
      .order("id", { ascending: true });

    videos = fallbackVideosQuery.data;
    videosError = fallbackVideosQuery.error;
  }

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

  let videos = null;
  let videosError = null;

  const videosWithTagsQuery = await supabase
    .from("Video")
    .select("id, url, modelId, tags")
    .eq("modelId", id)
    .order("id", { ascending: true });

  videos = videosWithTagsQuery.data;
  videosError = videosWithTagsQuery.error;

  if (videosError && isMissingColumnError(videosError, "tags")) {
    const fallbackVideosQuery = await supabase
      .from("Video")
      .select("id, url, modelId")
      .eq("modelId", id)
      .order("id", { ascending: true });

    videos = fallbackVideosQuery.data;
    videosError = fallbackVideosQuery.error;
  }

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

export async function createModel(data: {
  name: string;
  avatarUrl: string;
  description: string;
}) {
  let model = null;
  let error = null;

  const createWithDescription = await supabase
    .from("Models")
    .insert({
      name: data.name,
      avatarUrl: data.avatarUrl,
      description: data.description,
    })
    .select()
    .single();

  model = createWithDescription.data;
  error = createWithDescription.error;

  if (error && isMissingColumnError(error, "description")) {
    const createWithoutDescription = await supabase
      .from("Models")
      .insert({
        name: data.name,
        avatarUrl: data.avatarUrl,
      })
      .select()
      .single();

    model = createWithoutDescription.data;
    error = createWithoutDescription.error;
  }

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
    description: string;
  },
) {
  let error = null;

  const updateWithDescription = await supabase
    .from("Models")
    .update({
      name: data.name,
      avatarUrl: data.avatarUrl,
      description: data.description,
    })
    .eq("id", id);

  error = updateWithDescription.error;

  if (error && isMissingColumnError(error, "description")) {
    const updateWithoutDescription = await supabase
      .from("Models")
      .update({
        name: data.name,
        avatarUrl: data.avatarUrl,
      })
      .eq("id", id);

    error = updateWithoutDescription.error;
  }

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

export async function createVideo(data: {
  modelId: number;
  url: string;
  tags?: string[];
}) {
  let error = null;

  const createWithTags = await supabase.from("Video").insert({
    modelId: data.modelId,
    url: data.url,
    tags: data.tags ?? [],
  });

  error = createWithTags.error;

  if (error && isMissingColumnError(error, "tags")) {
    const createWithoutTags = await supabase.from("Video").insert({
      modelId: data.modelId,
      url: data.url,
    });

    error = createWithoutTags.error;
  }

  if (error) {
    console.error("Failed to create video:", error);
    throw error;
  }
}

export async function updateVideo(
  id: number,
  data: {
    url: string;
    tags?: string[];
  },
) {
  let error = null;

  const updateWithTags = await supabase
    .from("Video")
    .update({
      url: data.url,
      tags: data.tags ?? [],
    })
    .eq("id", id);

  error = updateWithTags.error;

  if (error && isMissingColumnError(error, "tags")) {
    const updateWithoutTags = await supabase
      .from("Video")
      .update({
        url: data.url,
      })
      .eq("id", id);

    error = updateWithoutTags.error;
  }

  if (error) {
    console.error("Failed to update video:", error);
    throw error;
  }
}

export async function deleteVideo(id: number) {
  const { error } = await supabase.from("Video").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete video:", error);
    throw error;
  }
}
