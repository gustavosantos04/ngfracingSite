import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

const ALLOWED_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"]
]);

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

function hasValidSignature(fileType: string, bytes: Buffer) {
  if (bytes.length < 12) {
    return false;
  }

  switch (fileType) {
    case "image/jpeg":
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    case "image/png":
      return (
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47 &&
        bytes[4] === 0x0d &&
        bytes[5] === 0x0a &&
        bytes[6] === 0x1a &&
        bytes[7] === 0x0a
      );
    case "image/webp":
      return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
    case "image/avif":
      return bytes.subarray(4, 8).toString("ascii") === "ftyp" && ["avif", "avis"].includes(bytes.subarray(8, 12).toString("ascii"));
    default:
      return false;
  }
}

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

  const bytes = Buffer.from(await file.arrayBuffer());

  if (!hasValidSignature(file.type, bytes)) {
    throw new Error("Conteudo de arquivo invalido para o tipo enviado.");
  }

  const uniqueName = `${randomUUID()}${extension}`;
  const target = path.join(uploadDir, uniqueName);

  await writeFile(target, bytes);

  return `/uploads/${uniqueName}`;
}
