import { CarStatus, Prisma } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { AdminOrder, PublicCar, PublicProduct, PublicProductSizeStock, PublicSiteSettings } from "@/lib/types";
import { siteSettings as defaultSettings } from "@/lib/siteContent";
import { parseJsonList, parseJsonObjectList, productCategoryLabel } from "@/lib/utils";

const copyReplacements: Array<[RegExp, string]> = [
  [/\bselecao\b/gi, "sele\u00e7\u00e3o"],
  [/\bproxima\b/gi, "pr\u00f3xima"],
  [/\bproximo\b/gi, "pr\u00f3ximo"],
  [/\bcomeca\b/gi, "come\u00e7a"],
  [/\borientacao\b/gi, "orienta\u00e7\u00e3o"],
  [/\bvoce\b/gi, "voc\u00ea"],
  [/\bnao\b/gi, "n\u00e3o"],
  [/\bcatalogo\b/gi, "cat\u00e1logo"],
  [/\bpecas\b/gi, "pe\u00e7as"],
  [/\bacessorios\b/gi, "acess\u00f3rios"],
  [/\bhistoria\b/gi, "hist\u00f3ria"],
  [/\bhistorico\b/gi, "hist\u00f3rico"],
  [/\bprocedencia\b/gi, "proced\u00eancia"],
  [/\bconfianca\b/gi, "confian\u00e7a"],
  [/\bconfiaveis\b/gi, "confi\u00e1veis"],
  [/\btecnico\b/gi, "t\u00e9cnico"],
  [/\btecnicos\b/gi, "t\u00e9cnicos"],
  [/\bconteudo\b/gi, "conte\u00fado"],
  [/\brapida\b/gi, "r\u00e1pida"],
  [/\bveiculos\b/gi, "ve\u00edculos"],
  [/\bdisponivel\b/gi, "dispon\u00edvel"],
  [/\bpreco\b/gi, "pre\u00e7o"],
  [/\bmaximo\b/gi, "m\u00e1ximo"],
  [/\bsessao\b/gi, "sess\u00e3o"],
  [/\binvalidas\b/gi, "inv\u00e1lidas"],
  [/\bendereco\b/gi, "endere\u00e7o"],
  [/\bhorario\b/gi, "hor\u00e1rio"],
  [/\bhorarios\b/gi, "hor\u00e1rios"],
  [/\bpagina\b/gi, "p\u00e1gina"],
  [/\bmodificacoes\b/gi, "modifica\u00e7\u00f5es"],
  [/\bcombustivel\b/gi, "combust\u00edvel"],
  [/\bcambio\b/gi, "c\u00e2mbio"],
  [/\bconfiguracoes\b/gi, "configura\u00e7\u00f5es"],
  [/\bconteudos\b/gi, "conte\u00fados"]
];

function applyCopyFixes(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  let normalized = value;
  for (const [pattern, replacement] of copyReplacements) {
    normalized = normalized.replace(pattern, replacement);
  }
  return normalized;
}

function normalizeSettingsText(settings: PublicSiteSettings): PublicSiteSettings {
  return {
    ...settings,
    heroTitle: applyCopyFixes(settings.heroTitle),
    heroSubtitle: applyCopyFixes(settings.heroSubtitle),
    heroPrimaryCtaLabel: applyCopyFixes(settings.heroPrimaryCtaLabel),
    heroSecondaryCtaLabel: applyCopyFixes(settings.heroSecondaryCtaLabel),
    aboutTitle: applyCopyFixes(settings.aboutTitle),
    aboutText: applyCopyFixes(settings.aboutText),
    phoneDisplay: applyCopyFixes(settings.phoneDisplay),
    address: applyCopyFixes(settings.address),
    addressLine: applyCopyFixes(settings.addressLine),
    addressRegion: applyCopyFixes(settings.addressRegion),
    addressCountry: applyCopyFixes(settings.addressCountry),
    businessHours: applyCopyFixes(settings.businessHours)
  };
}

function logDataFallback(scope: string, error: unknown) {
  console.error(`[data:${scope}] fallback`, error);
}

function shuffleArray<T>(items: T[]) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function mapCar(
  car: Prisma.CarGetPayload<{
    include: { images: true };
  }>
): PublicCar {
  return {
    id: car.id,
    slug: car.slug,
    title: car.title,
    brand: car.brand,
    model: car.model,
    year: car.year,
    km: car.km,
    priceCents: car.priceCents,
    description: car.description,
    mods: parseJsonList(car.modsJson),
    features: parseJsonList(car.featuresJson),
    tags: parseJsonList(car.tagsJson),
    fuel: car.fuel,
    transmission: car.transmission,
    status: car.status,
    isFeatured: car.isFeatured,
    whatsappLink: car.whatsappLink,
    images: car.images
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((image) => ({
        id: image.id,
        url: image.url,
        alt: image.alt,
        sortOrder: image.sortOrder
      }))
  };
}

function isProductSizeStock(value: unknown): value is PublicProductSizeStock {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.size === "string" && typeof candidate.stock === "number";
}

function mapProduct(product: Prisma.ProductGetPayload<Record<string, never>>): PublicProduct {
  const galleryUrls = parseJsonList(product.galleryJson);
  const images = [product.primaryImageUrl, ...galleryUrls]
    .filter((url, index, list) => Boolean(url) && list.indexOf(url) === index)
    .map((url, index) => ({
      id: `${product.id}-${index}`,
      url,
      alt: `${product.name} - foto ${index + 1}`,
      sortOrder: index
    }));
  const sizeStocks = parseJsonObjectList(product.sizeStockJson, isProductSizeStock)
    .map((item) => ({
      size: item.size.trim().toUpperCase(),
      stock: Math.max(0, Math.floor(item.stock))
    }))
    .filter((item) => item.size.length > 0);
  const totalStock =
    product.category === "APPAREL"
      ? sizeStocks.reduce((sum, item) => sum + item.stock, 0)
      : Math.max(0, product.stockQuantity ?? 0);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    categoryLabel: productCategoryLabel(product.category),
    description: product.description,
    priceCents: product.priceCents,
    primaryImageUrl: product.primaryImageUrl,
    images,
    stockQuantity: product.stockQuantity,
    sizeStocks,
    totalStock,
    isFeatured: product.isFeatured
  };
}

function mapOrder(order: Prisma.OrderGetPayload<Record<string, never>>): AdminOrder {
  return {
    id: order.id,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    status: order.status,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    productId: order.productId,
    productNameSnapshot: order.productNameSnapshot,
    productCategorySnapshot: order.productCategorySnapshot,
    productPriceSnapshot: order.productPriceSnapshot,
    quantity: order.quantity,
    selectedSize: order.selectedSize,
    notes: order.notes
  };
}

export async function getSiteSettings() {
  return normalizeSettingsText(defaultSettings);
}

export async function getAllCars() {
  try {
    const cars = await prisma.car.findMany({
      include: { images: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }]
    });

    return cars.map(mapCar);
  } catch (error) {
    logDataFallback("getAllCars", error);
    return [];
  }
}

export async function getFeaturedCars(limit = 3) {
  try {
    const cars = await prisma.car.findMany({
      where: {
        OR: [{ status: CarStatus.AVAILABLE }, { status: CarStatus.RESERVED }]
      },
      include: { images: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: limit
    });

    return cars.map(mapCar);
  } catch (error) {
    logDataFallback("getFeaturedCars", error);
    return [];
  }
}

export async function getCarBySlug(slug: string) {
  try {
    const car = await prisma.car.findUnique({
      where: { slug },
      include: { images: true }
    });

    return car ? mapCar(car) : null;
  } catch (error) {
    logDataFallback("getCarBySlug", error);
    return null;
  }
}

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }]
    });

    return products.map(mapProduct);
  } catch (error) {
    logDataFallback("getAllProducts", error);
    return [];
  }
}

export async function getFeaturedProducts(limit = 6) {
  try {
    noStore();

    const products = await prisma.product.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }]
    });

    return shuffleArray(products).slice(0, limit).map(mapProduct);
  } catch (error) {
    logDataFallback("getFeaturedProducts", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug }
    });

    return product ? mapProduct(product) : null;
  } catch (error) {
    logDataFallback("getProductBySlug", error);
    return null;
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    return product ? mapProduct(product) : null;
  } catch (error) {
    logDataFallback("getProductById", error);
    return null;
  }
}

export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: [{ createdAt: "desc" }]
    });

    return orders.map(mapOrder);
  } catch (error) {
    logDataFallback("getAllOrders", error);
    return [];
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id }
    });

    return order ? mapOrder(order) : null;
  } catch (error) {
    logDataFallback("getOrderById", error);
    return null;
  }
}
