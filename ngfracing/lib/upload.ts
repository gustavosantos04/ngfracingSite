import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"]
]);

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

export async function saveUploadedFile(file: File) {
  const extension = ALLOWED_TYPES.get(file.type);

  if (!extension) {
    throw new Error("Tipo de arquivo invalido. Envie JPG, PNG, WEBP ou AVIF.");
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Arquivo excede 5MB.");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
  const target = path.join(uploadDir, uniqueName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(target, bytes);

  return `/uploads/${uniqueName}`;
}
