import { NextResponse } from "next/server";
import { assertAdminRequest } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    await assertAdminRequest();
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)
      .slice(0, 8);

    const urls = await Promise.all(files.map((file) => saveUploadedFile(file)));
    return NextResponse.json({ urls });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Falha no upload."
      },
      { status: 400 }
    );
  }
}
