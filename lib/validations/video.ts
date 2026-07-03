import { z } from "zod"

export const videoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  embedUrl: z.string().url("Invalid embed URL").min(1, "Embed URL is required"),
  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional().or(z.literal("")),
  order: z.number().int().min(0, "Order must be a positive number"),
})

export type VideoFormData = z.infer<typeof videoSchema>
