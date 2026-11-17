import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { assertAdminRequest } from "@/lib/auth";
import { assertBlobEnvironment } from "@/lib/environment-safety";
import { prisma } from "@/lib/prisma";
import { isProductBlobUrl } from "@/lib/product-images";
import { ImageUploadError, prepareProductImage, readImageFormData } from "@/lib/product-image-upload";
import { assertSameOriginRequest, consumeRateLimit, getRequestFingerprint } from "@/lib/security";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  let uploadedUrl: string | undefined;
  try {
    assertSameOriginRequest(request);
    const admin = await assertAdminRequest();
    const rate = consumeRateLimit(getRequestFingerprint("product-images", request, admin.userId), {
      limit: 30, windowMs: 10 * 60 * 1000
    });
    if (!rate.allowed) throw new ImageUploadError("Muitos uploads. Aguarde alguns minutos e tente novamente.", 429);
    if (!process.env.BLOB_READ_WRITE_TOKEN || !process.env.BLOB_PUBLIC_HOSTNAME) {
      throw new ImageUploadError("Armazenamento de imagens não configurado. Contate o responsável pelo site.", 503);
    }
    try {
      assertBlobEnvironment(process.env.BLOB_PUBLIC_HOSTNAME, process.env.BLOB_READ_WRITE_TOKEN);
    } catch {
      throw new ImageUploadError("Armazenamento de imagens incompatível com este ambiente. Contate o responsável pelo site.", 503);
    }
    // Complement the project's per-instance attempt limiter with a shared successful-upload limit.
    const recentUploads = await prisma.productImageAsset.count({
      where: { uploadedBy: admin.userId, createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) } }
    });
    if (recentUploads >= 30) throw new ImageUploadError("Limite de 30 imagens em 10 minutos atingido. Aguarde.", 429);
    const form = await readImageFormData(request);
    const files = form.getAll("file");
    if (files.length !== 1 || !(files[0] instanceof File)) {
      throw new ImageUploadError("Envie exatamente uma imagem por requisição.");
    }
    const prepared = await prepareProductImage(files[0]);
    const blob = await put(`products/${randomUUID()}.webp`, prepared.bytes, {
      access: "public", contentType: prepared.contentType, addRandomSuffix: false,
      allowOverwrite: false, cacheControlMaxAge: 31536000
    });
    uploadedUrl = blob.url;
    if (!isProductBlobUrl(blob.url)) throw new Error("Blob hostname does not match configuration");
    const asset = await prisma.productImageAsset.create({
      data: {
        url: blob.url, pathname: blob.pathname, contentType: prepared.contentType,
        size: prepared.bytes.length, width: prepared.width, height: prepared.height,
        uploadedBy: admin.userId
      },
      select: { url: true, width: true, height: true }
    });
    return NextResponse.json(asset, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const status = message === "UNAUTHORIZED" ? 401 : message === "INVALID_ORIGIN" ? 403 :
      error instanceof ImageUploadError ? error.status : 500;
    if (status === 500) {
      // Never delete on uncertain DB/network outcomes. The unique asset can be audited later.
      console.error("[product-images] Upload failed", { uploadedUrl, error });
    }
    return NextResponse.json({ error: status === 401 ? "Sua sessão expirou. Entre novamente no painel." :
      status === 403 ? "Origem da requisição inválida." : error instanceof ImageUploadError ? error.message :
      "Não foi possível concluir o upload. Tente novamente; o produto não foi alterado."
    }, { status, headers: { "Cache-Control": "no-store" } });
  }
}
