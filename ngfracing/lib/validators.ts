import { CarStatus, OrderStatus, ProductCategory } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6)
});

export const carPayloadSchema = z.object({
  title: z.string().min(3),
  brand: z.string().min(2),
  model: z.string().min(2),
  year: z.coerce.number().int().min(1950).max(2100),
  km: z.coerce.number().int().min(0),
  priceCents: z.coerce.number().int().min(0),
  description: z.string().min(20),
  mods: z.array(z.string()).max(20),
  features: z.array(z.string()).max(30),
  tags: z.array(z.string()).max(12),
  fuel: z.string().optional().nullable(),
  transmission: z.string().optional().nullable(),
  status: z.nativeEnum(CarStatus),
  isFeatured: z.boolean(),
  whatsappLink: z.string().url().optional().nullable(),
  imageUrls: z.array(z.string()).min(1).max(8)
});

export const productSizeStockSchema = z.object({
  size: z.string().min(1),
  stock: z.number().int().min(0)
});

export const productPayloadSchema = z
  .object({
    name: z.string().min(2),
    category: z.nativeEnum(ProductCategory),
    description: z.string().min(10),
    priceCents: z.number().int().min(0),
    primaryImageUrl: z.string().min(1),
    galleryUrls: z.array(z.string()).max(8),
    stockQuantity: z.number().int().min(0).nullable(),
    sizeStocks: z.array(productSizeStockSchema),
    isFeatured: z.boolean()
  })
  .superRefine((value, ctx) => {
    if (value.category === ProductCategory.APPAREL) {
      if (!value.sizeStocks.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sizeStocks"],
          message: "Informe ao menos um tamanho para roupas."
        });
      }

      const hasStock = value.sizeStocks.some((item) => item.stock > 0);
      if (!hasStock) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sizeStocks"],
          message: "Ao menos um tamanho deve ter estoque."
        });
      }
    } else if (value.stockQuantity === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["stockQuantity"],
        message: "Informe o estoque disponível."
      });
    }
  });

export const purchaseRequestSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
  size: z.string().trim().optional().nullable(),
  fullName: z.string().min(5),
  email: z.string().email(),
  phone: z
    .string()
    .min(10)
    .refine((value) => value.replace(/\D/g, "").length >= 10, "Telefone inválido."),
  address: z.string().min(10)
});

export const orderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.nativeEnum(OrderStatus),
  notes: z.string().trim().optional().nullable()
});
