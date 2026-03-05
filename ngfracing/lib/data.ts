import { CarStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  PublicCar,
  PublicPartCategory,
  PublicSiteSettings
} from "@/lib/types";
import { parseJsonList } from "@/lib/utils";

const defaultSettings: PublicSiteSettings = {
  id: "site_settings",
  heroTitle: "Acelerando rumo a sua melhor conquista sobre quatro rodas.",
  heroSubtitle:
    "NGF Racing: seminovos, projetos diferenciados e pecas de alta performance com procedencia.",
  heroBgImage: "/branding/hero-car.jpg",
  heroPrimaryCtaLabel: "Ver estoque",
  heroPrimaryCtaHref: "/estoque",
  heroSecondaryCtaLabel: "Falar no WhatsApp",
  heroSecondaryCtaHref: "https://wa.me/5551999866578",
  aboutTitle: "Nossa historia",
  aboutText:
    "Da pista para a loja, a NGF Racing combina paixao por performance com curadoria de carros seminovos, antigos modificados e pecas de alta performance.",
  aboutImage: "/branding/carro-corrida-antigo.jpg",
  phoneWhatsapp: "5551999866578",
  phoneDisplay: "(51) 99986-6578",
  contactEmail: "ngfracing@hotmail.com",
  address: "Porto Alegre, RS",
  instagramUrl: "https://instagram.com/ngfracing",
  businessHours: "Segunda a Sexta: 8h as 18h | Sabado: 9h as 15h"
};

function logDataFallback(scope: string, error: unknown) {
  console.error(`[data:${scope}] fallback`, error);
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

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "site_settings" }
    });

    return settings ?? defaultSettings;
  } catch (error) {
    logDataFallback("getSiteSettings", error);
    return defaultSettings;
  }
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

export async function getPartCategories() {
  try {
    const categories = await prisma.partCategory.findMany({
      include: {
        items: {
          orderBy: [{ isFeatured: "desc" }, { name: "asc" }]
        }
      },
      orderBy: { name: "asc" }
    });

    return categories.map(
      (category): PublicPartCategory => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        items: category.items.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          imageUrl: item.imageUrl,
          isFeatured: item.isFeatured
        }))
      })
    );
  } catch (error) {
    logDataFallback("getPartCategories", error);
    return [];
  }
}
