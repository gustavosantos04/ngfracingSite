import type { CarStatus } from "@prisma/client";

export type PublicCar = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  priceCents: number;
  description: string;
  mods: string[];
  features: string[];
  tags: string[];
  fuel: string | null;
  transmission: string | null;
  status: CarStatus;
  isFeatured: boolean;
  whatsappLink: string | null;
  images: Array<{
    id: string;
    url: string;
    alt: string;
    sortOrder: number;
  }>;
};

export type PublicPart = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  isFeatured: boolean;
};

export type PublicPartCategory = {
  id: string;
  name: string;
  slug: string;
  items: PublicPart[];
};

export type PublicSiteSettings = {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  phoneWhatsapp: string;
  phoneDisplay: string;
  contactEmail: string;
  address: string;
  instagramUrl: string;
  businessHours: string;
};
