import { z } from "zod"

export const modelSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  avatarUrl: z.string().url("Invalid avatar URL").min(1, "Avatar URL is required"),
  videoEmbedUrl: z.string().url("Invalid video embed URL").optional().or(z.literal("")),
  description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
})

export type ModelFormData = z.infer<typeof modelSchema>
