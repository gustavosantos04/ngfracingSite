import type { ProductCategory } from "@prisma/client";
import type { PublicProduct, PublicProductSizeStock } from "@/lib/types";

export function parseSizeStocksInput(value: string): PublicProductSizeStock[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [rawSize, rawStock] = line.split(":").map((part) => part.trim());
      return {
        size: (rawSize ?? "").toUpperCase(),
        stock: Math.max(0, Number.parseInt(rawStock ?? "0", 10) || 0)
      };
    })
    .filter((item) => item.size.length > 0);
}

export function serializeSizeStocks(value: PublicProductSizeStock[]) {
  return value.map((item) => `${item.size}:${item.stock}`).join("\n");
}

export function getAvailableStock(product: PublicProduct, selectedSize?: string | null) {
  if (product.category === "APPAREL") {
    if (!selectedSize) {
      return 0;
    }

    const match = product.sizeStocks.find((item) => item.size === selectedSize.toUpperCase());
    return match?.stock ?? 0;
  }

  return product.stockQuantity ?? 0;
}

export function hasSelectableSizes(category: ProductCategory | PublicProduct["category"]) {
  return category === "APPAREL";
}

export function formatProductAvailability(product: PublicProduct, selectedSize?: string | null) {
  const available = getAvailableStock(product, selectedSize);

  if (product.category === "APPAREL") {
    if (!selectedSize) {
      return "Selecione um tamanho para ver a disponibilidade.";
    }

    return available > 0 ? `${available} un. disponíveis no tamanho ${selectedSize}.` : `Tamanho ${selectedSize} indisponível.`;
  }

  return available > 0 ? `${available} un. disponíveis.` : "Sem estoque no momento.";
}
