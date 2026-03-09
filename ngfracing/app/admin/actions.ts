"use server";

import { CarStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticateAdmin, requireAdminSession, signAdminToken } from "@/lib/auth";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";
import { carPayloadSchema, loginSchema, partItemPayloadSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

function splitLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function extractImageUrls(formData: FormData, existing: string[] = []) {
  const uploadedFiles = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (uploadedFiles.length + existing.length > 8) {
    throw new Error("Limite máximo de 8 imagens por carro.");
  }

  const uploadedUrls = await Promise.all(uploadedFiles.map((file) => saveUploadedFile(file)));
  return [...existing, ...uploadedUrls].slice(0, 8);
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    redirect("/admin/login?error=Credenciais-invalidas");
  }

  const user = await authenticateAdmin(parsed.data.identifier, parsed.data.password);
  if (!user) {
    redirect("/admin/login?error=Credenciais-invalidas");
  }

  const token = await signAdminToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/admin/login");
}

export async function saveCarAction(formData: FormData) {
  await requireAdminSession();

  const carId = String(formData.get("carId") ?? "").trim();
  const existingUrls = splitLines(formData.get("existingImageUrls"));
  const imageUrls = await extractImageUrls(formData, existingUrls);

  const payload = carPayloadSchema.parse({
    title: formData.get("title"),
    brand: formData.get("brand"),
    model: formData.get("model"),
    year: formData.get("year"),
    km: formData.get("km"),
    priceCents: Math.round(Number(formData.get("price") ?? 0) * 100),
    description: formData.get("description"),
    mods: splitLines(formData.get("mods")),
    features: splitLines(formData.get("features")),
    tags: splitLines(formData.get("tags")),
    fuel: String(formData.get("fuel") ?? "") || null,
    transmission: String(formData.get("transmission") ?? "") || null,
    status: (formData.get("status") as CarStatus) ?? CarStatus.AVAILABLE,
    isFeatured: formData.get("isFeatured") === "on",
    whatsappLink: String(formData.get("whatsappLink") ?? "") || null,
    imageUrls
  });

  const data = {
    slug: slugify(`${payload.brand}-${payload.model}-${payload.year}`),
    title: payload.title,
    brand: payload.brand,
    model: payload.model,
    year: payload.year,
    km: payload.km,
    priceCents: payload.priceCents,
    description: payload.description,
    modsJson: JSON.stringify(payload.mods),
    featuresJson: JSON.stringify(payload.features),
    tagsJson: JSON.stringify(payload.tags),
    fuel: payload.fuel,
    transmission: payload.transmission,
    status: payload.status,
    isFeatured: payload.isFeatured,
    whatsappLink: payload.whatsappLink
  };

  const persisted = carId
    ? await prisma.car.update({ where: { id: carId }, data })
    : await prisma.car.create({ data });

  await prisma.carImage.deleteMany({ where: { carId: persisted.id } });
  await prisma.carImage.createMany({
    data: payload.imageUrls.map((url, index) => ({
      carId: persisted.id,
      url,
      alt: `${payload.title} - foto ${index + 1}`,
      sortOrder: index
    }))
  });

  revalidatePath("/");
  revalidatePath("/estoque");
  revalidatePath(`/estoque/${persisted.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/carros");
  redirect("/admin/carros?saved=1");
}

export async function deleteCarAction(formData: FormData) {
  await requireAdminSession();
  const carId = String(formData.get("carId") ?? "");

  if (carId) {
    await prisma.car.delete({ where: { id: carId } });
  }

  revalidatePath("/");
  revalidatePath("/estoque");
  revalidatePath("/admin");
  revalidatePath("/admin/carros");
  redirect("/admin/carros?deleted=1");
}

export async function savePartCategoryAction(formData: FormData) {
  await requireAdminSession();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    redirect("/admin/pecas?error=Categoria-invalida");
  }

  const slug = slugify(name);
  await prisma.partCategory.upsert({
    where: { slug },
    update: { name },
    create: { name, slug }
  });

  revalidatePath("/pecas");
  revalidatePath("/admin/pecas");
  redirect("/admin/pecas?saved=1");
}

export async function savePartItemAction(formData: FormData) {
  await requireAdminSession();

  const itemId = String(formData.get("itemId") ?? "").trim();
  const payload = partItemPayloadSchema.parse({
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    description: formData.get("description"),
    imageUrl: String(formData.get("imageUrl") ?? "") || null,
    isFeatured: formData.get("isFeatured") === "on"
  });

  const data = {
    categoryId: payload.categoryId,
    name: payload.name,
    description: payload.description,
    imageUrl: payload.imageUrl,
    isFeatured: payload.isFeatured,
    slug: slugify(payload.name)
  };

  if (itemId) {
    await prisma.partItem.update({ where: { id: itemId }, data });
  } else {
    await prisma.partItem.create({ data });
  }

  revalidatePath("/pecas");
  revalidatePath("/admin/pecas");
  redirect("/admin/pecas?saved=1");
}

export async function deletePartItemAction(formData: FormData) {
  await requireAdminSession();
  const itemId = String(formData.get("itemId") ?? "");

  if (itemId) {
    await prisma.partItem.delete({ where: { id: itemId } });
  }

  revalidatePath("/pecas");
  revalidatePath("/admin/pecas");
  redirect("/admin/pecas?deleted=1");
}
