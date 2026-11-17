import sharp from "sharp";
import { MAX_PRODUCT_IMAGE_SIZE, validateProductImageFile } from "@/lib/product-images";

export class ImageUploadError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

// Enforce the limit even when Content-Length is absent or forged.
export async function readImageFormData(request: Request) {
  const maxBodySize = MAX_PRODUCT_IMAGE_SIZE + 64 * 1024;
  if (Number(request.headers.get("content-length")) > maxBodySize) {
    throw new ImageUploadError("Envie uma imagem por vez, com até 4 MiB.", 413);
  }
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data;")) {
    throw new ImageUploadError("Envie o arquivo como formulário multipart.");
  }
  const reader = request.body?.getReader();
  if (!reader) throw new ImageUploadError("Nenhum arquivo enviado.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodySize) {
        await reader.cancel();
        throw new ImageUploadError("Envie uma imagem por vez, com até 4 MiB.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    return await new Response(Buffer.concat(chunks), {
      headers: { "Content-Type": request.headers.get("content-type")! }
    }).formData();
  } catch {
    throw new ImageUploadError("Formulário de upload inválido.");
  }
}

export async function prepareProductImage(file: File) {
  const error = validateProductImageFile(file);
  if (error) throw new ImageUploadError(error);
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const image = sharp(bytes, { limitInputPixels: 40_000_000, failOn: "warning" });
    const metadata = await image.metadata();
    const expectedFormats: Record<string, string> = {
      "image/jpeg": "jpeg", "image/png": "png", "image/webp": "webp", "image/avif": "heif"
    };
    if (metadata.format !== expectedFormats[file.type] || (metadata.pages ?? 1) > 1) {
      throw new Error("Unsupported image");
    }
    // Decode and re-encode: reject corrupt content, strip metadata and prevent active files.
    const { data, info } = await image.rotate().resize({
      width: 2400, height: 2400, fit: "inside", withoutEnlargement: true
    }).webp({ quality: 88 }).toBuffer({ resolveWithObject: true });
    return { bytes: data, width: info.width, height: info.height, contentType: "image/webp" };
  } catch {
    throw new ImageUploadError("Imagem inválida, corrompida, animada ou acima de 40 megapixels.");
  }
}
