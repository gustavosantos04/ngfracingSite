import { CarStatus } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
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

export const partCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2)
});

export const partItemPayloadSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(2),
  description: z.string().min(10),
  imageUrl: z.string().optional().nullable(),
  isFeatured: z.boolean()
});
