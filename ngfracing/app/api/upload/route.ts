import { NextResponse } from "next/server";
import { assertAdminRequest } from "@/lib/auth";
import { assertSameOriginRequest, consumeRateLimit, getRequestFingerprint } from "@/lib/security";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    assertSameOriginRequest(request);
    await assertAdminRequest();
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)
      .slice(0, 8);

    if (!files.length) {
      return NextResponse.json({ error: "Nenhum arquivo valido enviado." }, { status: 400 });
    }

    const rateLimitKey = getRequestFingerprint("admin-upload", request, "files");
    const uploadRateLimit = consumeRateLimit(rateLimitKey, {
      limit: 30,
      windowMs: 10 * 60 * 1000
    });

    if (!uploadRateLimit.allowed) {
      return NextResponse.json({ error: "Muitas tentativas de upload. Aguarde e tente novamente." }, { status: 429 });
    }

    const urls = await Promise.all(files.map((file) => saveUploadedFile(file)));
    return NextResponse.json({ urls });
  } catch (error) {
    const status =
      error instanceof Error && error.message === "INVALID_ORIGIN"
        ? 403
        : error instanceof Error && error.message === "UNAUTHORIZED"
          ? 401
          : 400;

    return NextResponse.json(
      {
        error:
          status === 403
            ? "Origem da requisicao invalida."
            : status === 401
              ? "Nao autorizado."
              : "Falha no upload."
      },
      { status }
    );
  }
}
