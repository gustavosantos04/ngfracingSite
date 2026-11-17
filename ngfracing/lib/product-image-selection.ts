import { parseJsonList } from "@/lib/utils";

export function assertKnownProductImages(
  selected: string[], repository: string[], uploaded: string[],
  existing?: { primaryImageUrl: string; galleryJson: string } | null
) {
  const known = new Set([
    ...repository, ...uploaded,
    ...(existing ? [existing.primaryImageUrl, ...parseJsonList(existing.galleryJson)] : [])
  ]);
  if (selected.some((url) => !known.has(url))) throw new Error("UNKNOWN_PRODUCT_IMAGE");
}
