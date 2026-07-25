"use server";

import { getModels } from "@/lib/supabase/models";

interface CBApiModel {
  username: string;
  current_show: string;
  image_url: string;
  gender: string;
}

export interface ModelWithStatus {
  id: number;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
  imageUrl?: string;
  showVideo: boolean;
}

export async function checkModelsAction(): Promise<ModelWithStatus[]> {
  // Fetch models from Supabase
  const dbModels = await getModels();
  
  // Fetch Chaturbate API data
  const cbApi = 'https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=3YHSK';
  const response = await fetch(cbApi);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const cbData: CBApiModel[] = await response.json();
  
  // Check each model against CB data
  return dbModels.map((model: any) => {
    const cbModel = cbData.find(
      (item) => item.username.toLowerCase() === model.name.toLowerCase()
    );
    
    const isOnline = !!(cbModel && cbModel.current_show === 'public');
    
    return {
      id: model.id,
      name: model.name,
      avatarUrl: model.avatarUrl,
      isOnline,
      imageUrl: isOnline ? cbModel?.image_url : undefined,
      showVideo: false,
    };
  });
}
