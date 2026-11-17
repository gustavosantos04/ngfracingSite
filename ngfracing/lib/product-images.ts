import { MAX_PRODUCT_GALLERY_SELECTION } from "@/lib/admin-media";

export const MAX_PRODUCT_IMAGE_SIZE = 4 * 1024 * 1024;
export const PRODUCT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const MAX_PRODUCT_IMAGES = MAX_PRODUCT_GALLERY_SELECTION + 1;

export function validateProductImageFile(file: Pick<File, "size" | "type">) {
  if (!PRODUCT_IMAGE_TYPES.includes(file.type)) {
    return "Formato inválido. Envie JPG, PNG, WebP ou AVIF.";
  }
  if (file.size <= 0 || file.size > MAX_PRODUCT_IMAGE_SIZE) {
    return "Cada imagem deve ter conteúdo e no máximo 4 MiB.";
  }
  return null;
}

export function isProductBlobUrl(value: string, hostname = process.env.BLOB_PUBLIC_HOSTNAME) {
  if (!hostname) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === hostname && !url.port &&
      !url.username && !url.password && !url.search && !url.hash &&
      /^\/products\/[a-f0-9-]{36}\.webp$/.test(url.pathname);
  } catch {
    return false;
  }
}

export function moveProductImage<T>(images: T[], from: number, to: number): T[] {
  if (from < 0 || to < 0 || from >= images.length || to >= images.length) return images;
  const next = [...images];
  const [image] = next.splice(from, 1);
  next.splice(to, 0, image);
  return next;
}
