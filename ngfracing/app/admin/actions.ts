"use server";

import { CarStatus, OrderStatus, Prisma, ProductCategory } from "@prisma/client";
import { ZodError } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticateAdmin, getAdminAuthConfigStatus, requireAdminSession, signAdminToken } from "@/lib/auth";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { parseSizeStocksInput } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { assertSameOriginActionRequest, consumeRateLimit, getActionRequestFingerprint } from "@/lib/security";
import { carPayloadSchema, loginSchema, orderStatusSchema, productPayloadSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";
import { getRepositoryProductImages } from "@/lib/image-library";
import { assertKnownProductImages } from "@/lib/product-image-selection";

function splitLines(...entries: Array<FormDataEntryValue | null | undefined>) {
  return entries
    .flatMap((entry) => String(entry ?? "").split(/\r?\n|,/))
    .map((item) => item.trim())
    .filter(Boolean);
}

function getTextList(formData: FormData, fieldName: string) {
  const values = splitLines(...formData.getAll(fieldName));
  const seen = new Set<string>();

  return values.filter((value) => {
    const normalized = value.toLocaleLowerCase("pt-BR");
    if (seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
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
  try {
    await assertSameOriginActionRequest();
  } catch {
    redirect("/admin/login?error=request-invalida");
  }

  const authConfig = getAdminAuthConfigStatus();
  if (!authConfig.ok) {
    redirect("/admin/login?error=configuracao-invalida");
  }

  const identifier = String(formData.get("identifier") ?? "");
  const rateLimitKey = await getActionRequestFingerprint("admin-login", identifier);
  const loginRateLimit = consumeRateLimit(rateLimitKey, {
    limit: 8,
    windowMs: 10 * 60 * 1000
  });

  if (!loginRateLimit.allowed) {
    redirect("/admin/login?error=limite-excedido");
  }

  const parsed = loginSchema.safeParse({
    identifier,
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
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
    priority: "high"
  });

  redirect("/admin");
}

export async function logoutAction() {
  await assertSameOriginActionRequest();
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/admin/login");
}

export async function saveCarAction(formData: FormData) {
  await assertSameOriginActionRequest();
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
    mods: [],
    features: getTextList(formData, "features"),
    tags: getTextList(formData, "tags"),
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
    modsJson: JSON.stringify([]),
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
  await assertSameOriginActionRequest();
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
  await assertSameOriginActionRequest();
  await requireAdminSession();

  let savedSlug = "";
  let previousSlug = "";
  try {
    const productId = String(formData.get("productId") ?? "").trim();
    const existingProduct = productId
      ? await prisma.product.findUnique({ where: { id: productId }, select: { slug: true, primaryImageUrl: true, galleryJson: true } })
      : null;
    if (productId && !existingProduct) return { error: "Produto não encontrado. Recarregue o painel." };
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

    const selectedUrls = [payload.primaryImageUrl, ...payload.galleryUrls];
    const remoteUrls = selectedUrls.filter((url) => url.startsWith("https://"));
    const [repositoryImages, uploadedImages] = await Promise.all([
      getRepositoryProductImages(),
      remoteUrls.length ? prisma.productImageAsset.findMany({
        where: { url: { in: remoteUrls } }, select: { url: true }
      }) : Promise.resolve([])
    ]);
    assertKnownProductImages(selectedUrls, repositoryImages.map((image) => image.url),
      uploadedImages.map((image) => image.url), existingProduct);

    // Product fields and the entire gallery are persisted together in a single atomic write.
    if (productId) {
      await prisma.product.update({ where: { id: productId }, data });
    } else {
      await prisma.product.create({ data });
    }
    savedSlug = data.slug;
    previousSlug = existingProduct?.slug ?? "";
  } catch (error) {
    if (error instanceof ZodError) return { error: error.issues[0]?.message || "Confira os dados do produto." };
    if (error instanceof Error && error.message === "UNKNOWN_PRODUCT_IMAGE") {
      return { error: "Uma imagem não foi confirmada. Envie-a novamente ou selecione uma imagem da biblioteca." };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Já existe um produto com este nome. Ajuste o nome e tente novamente." };
    }
    console.error("[products] Save failed", error);
    return { error: "Não foi possível salvar o produto. Suas imagens foram preservadas; tente novamente." };
  }

  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath(`/produtos/${savedSlug}`);
  if (previousSlug && previousSlug !== savedSlug) {
    revalidatePath(`/produtos/${previousSlug}`);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos?saved=1");
}

export async function deleteProductAction(formData: FormData) {
  await assertSameOriginActionRequest();
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
  await assertSameOriginActionRequest();
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
