import { CarStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PublicCar, PublicPartCategory, PublicSiteSettings } from "@/lib/types";
import { parseJsonList } from "@/lib/utils";

const defaultSettings: PublicSiteSettings = {
  id: "site_settings",
  heroTitle: "Sele\u00e7\u00e3o premium para quem vive performance de verdade.",
  heroSubtitle:
    "Seminovos selecionados, projetos preparados e atendimento pr\u00f3ximo para voc\u00ea comprar com seguran\u00e7a.",
  heroBgImage: "/branding/hero-car.jpg",
  heroPrimaryCtaLabel: "Quero meu carro",
  heroPrimaryCtaHref: "/estoque",
  heroSecondaryCtaLabel: "Falar com a NGF",
  heroSecondaryCtaHref: "https://wa.me/5551999866578",
  aboutTitle: "Paix\u00e3o por velocidade, compromisso com proced\u00eancia",
  aboutText:
    "Da pista para as ruas, a NGF Racing entrega curadoria especializada, transpar\u00eancia e projetos que unem confiabilidade e desempenho.",
  aboutImage: "/branding/carro-corrida-antigo.jpg",
  phoneWhatsapp: "5551999866578",
  phoneDisplay: "(51) 99986-6578",
  contactEmail: "ngfracing@hotmail.com",
  address: "R. Ver\u00edssimo Rosa, 452 - Partenon",
  instagramUrl: "https://instagram.com/ngfracing",
  businessHours: "Segunda a Sexta: 8h \u00e0s 18h | S\u00e1bado: 9h \u00e0s 15h"
};

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
    businessHours: applyCopyFixes(settings.businessHours)
  };
}

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

    return normalizeSettingsText(settings ?? defaultSettings);
  } catch (error) {
    logDataFallback("getSiteSettings", error);
    return normalizeSettingsText(defaultSettings);
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