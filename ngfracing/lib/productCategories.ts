import type { ProductCategory } from "@prisma/client";
import type { PublicProduct } from "@/lib/types";

export const PRODUCT_CATEGORY_QUERY_KEY = "categoria";

export type ProductCategoryFilterOption = {
  category: ProductCategory | null;
  slug: string | null;
  label: string;
  shortLabel: string;
  description: string;
  accent: string;
};

export const productCategoryFilterOptions: ProductCategoryFilterOption[] = [
  {
    category: null,
    slug: null,
    label: "Todos os produtos",
    shortLabel: "Todos",
    description: "Veja todo o catálogo da NGF Racing em uma única grade.",
    accent: "ALL"
  },
  {
    category: "PART",
    slug: "part",
    label: "Peças",
    shortLabel: "Peças",
    description: "Componentes e itens de performance para o seu projeto.",
    accent: "PRT"
  },
  {
    category: "ACCESSORY",
    slug: "accessory",
    label: "Acessórios",
    shortLabel: "Acessórios",
    description: "Complementos para acabamento, uso diário e identidade do carro.",
    accent: "ACC"
  },
  {
    category: "APPAREL",
    slug: "apparel",
    label: "Roupas",
    shortLabel: "Roupas",
    description: "Camisetas e itens de vestuario com a assinatura da NGF Racing.",
    accent: "APP"
  }
];

export function parseProductCategoryQuery(value: string | string[] | undefined) {
  const normalized = String(Array.isArray(value) ? value[0] ?? "" : value ?? "")
    .trim()
    .toLowerCase();

  switch (normalized) {
    case "part":
      return "PART" as const;
    case "accessory":
      return "ACCESSORY" as const;
    case "apparel":
      return "APPAREL" as const;
    default:
      return null;
  }
}

export function getProductsCategoryHref(category: ProductCategory | null) {
  if (!category) {
    return "/produtos";
  }

  const option = productCategoryFilterOptions.find((item) => item.category === category);
  return option?.slug ? `/produtos?${PRODUCT_CATEGORY_QUERY_KEY}=${option.slug}` : "/produtos";
}

export function filterProductsByCategory(products: PublicProduct[], category: ProductCategory | null) {
  if (!category) {
    return products;
  }

  return products.filter((product) => product.category === category);
}

export function countProductsByCategory(products: PublicProduct[]) {
  return {
    all: products.length,
    PART: products.filter((product) => product.category === "PART").length,
    ACCESSORY: products.filter((product) => product.category === "ACCESSORY").length,
    APPAREL: products.filter((product) => product.category === "APPAREL").length
  };
}
