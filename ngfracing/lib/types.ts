import type { CarStatus, OrderStatus, ProductCategory } from "@prisma/client";

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

export type PublicProductSizeStock = {
  size: string;
  stock: number;
};

export type PublicProduct = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  description: string;
  priceCents: number;
  primaryImageUrl: string;
  images: Array<{
    id: string;
    url: string;
    alt: string;
    sortOrder: number;
  }>;
  stockQuantity: number | null;
  sizeStocks: PublicProductSizeStock[];
  totalStock: number;
  isFeatured: boolean;
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
  addressLine: string;
  addressRegion: string;
  addressCountry: string;
  instagramUrl: string;
  businessHours: string;
};

export type AdminOrder = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  productId: string;
  productNameSnapshot: string;
  productCategorySnapshot: string;
  productPriceSnapshot: number;
  quantity: number;
  selectedSize: string | null;
  notes: string | null;
};
