export const AVAILABLE_MODEL_TAGS = [
  "Hire",
  "Ride",
  "BigBoobs",
  "Asian",
  "Pillow",
  "HandJob",
  "Scissors",
  "Kiss",
  "Lesbian",
  "Doggy",
  "BigAss",
  "LickTits",
  "Lick",
  "Body",
  "Under",
  "Close",
] as const;

export type ModelTag = (typeof AVAILABLE_MODEL_TAGS)[number];

export function normalizeModelTags(value: unknown): ModelTag[] {
  if (Array.isArray(value)) {
    return value.filter(
      (tag): tag is ModelTag =>
        typeof tag === "string" &&
        AVAILABLE_MODEL_TAGS.includes(tag as ModelTag),
    );
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag): tag is ModelTag =>
        AVAILABLE_MODEL_TAGS.includes(tag as ModelTag),
      );
  }

  return [];
}
