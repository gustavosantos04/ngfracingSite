"use server";

import { CarStatus, OrderStatus, ProductCategory } from "@prisma/client";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticateAdmin, getAdminAuthConfigStatus, requireAdminSession, signAdminToken } from "@/lib/auth";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { parseSizeStocksInput } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { carPayloadSchema, loginSchema, orderStatusSchema, productPayloadSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

function splitLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSelectedImageUrls(formData: FormData, primaryFieldName: string, galleryFieldName: string) {
  const primaryImage = String(formData.get(primaryFieldName) ?? "").trim();
  const galleryImages = formData
    .getAll(galleryFieldName)
    .map((entry) => String(entry).trim())
    .filter(Boolean);

  return [primaryImage, ...galleryImages].filter((url, index, list) => Boolean(url) && list.indexOf(url) === index);
}

function getCarImageUrls(formData: FormData) {
  const selectedImages = getSelectedImageUrls(formData, "selectedPrimaryImage", "selectedGalleryImages");
  if (selectedImages.length > 0) {
    return selectedImages;
  }

  return splitLines(formData.get("existingImageUrls"));
}

function getProductImageSelection(formData: FormData) {
  const primaryImageUrl =
    String(formData.get("selectedPrimaryImage") ?? "").trim() ||
    String(formData.get("primaryImageUrl") ?? "").trim();
  const galleryUrls = formData
    .getAll("selectedGalleryImages")
    .map((entry) => String(entry).trim())
    .filter(Boolean);

  return {
    primaryImageUrl,
    galleryUrls: galleryUrls.filter((url, index, list) => url !== primaryImageUrl && list.indexOf(url) === index)
  };
}

export async function loginAction(formData: FormData) {
  const authConfig = getAdminAuthConfigStatus();
  if (!authConfig.ok) {
    redirect("/admin/login?error=configuracao-invalida");
  }

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
  const imageUrls = getCarImageUrls(formData);

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

export async function saveProductAction(formData: FormData) {
  await requireAdminSession();

  const productId = String(formData.get("productId") ?? "").trim();
  const existingProduct = productId
    ? await prisma.product.findUnique({ where: { id: productId }, select: { slug: true } })
    : null;
  const { primaryImageUrl, galleryUrls } = getProductImageSelection(formData);
  const category = (String(formData.get("category") ?? "").trim().toUpperCase() || "PART") as ProductCategory;
  const parsedSizeStocks = parseSizeStocksInput(String(formData.get("sizeStocks") ?? ""));
  const rawStock = String(formData.get("stockQuantity") ?? "").trim();

  const payload = productPayloadSchema.parse({
    name: formData.get("name"),
    category,
    description: formData.get("description"),
    priceCents: Math.round(Number(formData.get("price") ?? 0) * 100),
    primaryImageUrl,
    galleryUrls,
    stockQuantity:
      category === ProductCategory.APPAREL
        ? null
        : rawStock === ""
          ? null
          : Number.parseInt(rawStock, 10),
    sizeStocks: category === ProductCategory.APPAREL ? parsedSizeStocks : [],
    isFeatured: formData.get("isFeatured") === "on"
  });

  const data = {
    name: payload.name,
    slug: slugify(payload.name),
    category: payload.category,
    description: payload.description,
    priceCents: payload.priceCents,
    primaryImageUrl: payload.primaryImageUrl,
    galleryJson: JSON.stringify(payload.galleryUrls),
    stockQuantity: payload.category === ProductCategory.APPAREL ? null : payload.stockQuantity,
    sizeStockJson: JSON.stringify(payload.category === ProductCategory.APPAREL ? payload.sizeStocks : []),
    isFeatured: payload.isFeatured
  };

  if (productId) {
    await prisma.product.update({ where: { id: productId }, data });
  } else {
    await prisma.product.create({ data });
  }

  revalidatePath("/produtos");
  revalidatePath(`/produtos/${data.slug}`);
  if (existingProduct?.slug && existingProduct.slug !== data.slug) {
    revalidatePath(`/produtos/${existingProduct.slug}`);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos?saved=1");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdminSession();
  const productId = String(formData.get("productId") ?? "");

  if (productId) {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true }
    });
    await prisma.product.delete({ where: { id: productId } });
    if (existingProduct?.slug) {
      revalidatePath(`/produtos/${existingProduct.slug}`);
    }
  }

  revalidatePath("/produtos");
  revalidatePath("/admin");
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos?deleted=1");
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdminSession();

  const parsed = orderStatusSchema.parse({
    orderId: formData.get("orderId"),
    status: formData.get("status") as OrderStatus,
    notes: String(formData.get("notes") ?? "").trim() || null
  });

  await prisma.order.update({
    where: { id: parsed.orderId },
    data: {
      status: parsed.status,
      notes: parsed.notes
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${parsed.orderId}`);
  redirect(`/admin/pedidos/${parsed.orderId}?saved=1`);
}
