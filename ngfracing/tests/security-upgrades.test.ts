import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, writeFile, unlink, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { loadConfigFromFile } from "@prisma/config";
import { carPayloadSchema, loginSchema, orderStatusSchema, productPayloadSchema, purchaseRequestSchema } from "../lib/validators";

const product = { name: "Produto antigo", category: "PART", description: "Descrição do produto existente", priceCents: 12500,
  primaryImageUrl: "/uploads/legacy.jpg", galleryUrls: [], stockQuantity: 2, sizeStocks: [], isFeatured: false };

test("patched validation preserves product categories, stock requirements and optional purchase fields", () => {
  assert.deepEqual(productPayloadSchema.parse(product), product);
  assert.equal(productPayloadSchema.safeParse({ ...product, stockQuantity: null }).success, false);
  assert.equal(productPayloadSchema.safeParse({ ...product, category: "APPAREL", stockQuantity: null, sizeStocks: [{ size: "M", stock: 1 }] }).success, true);
  assert.equal(productPayloadSchema.safeParse({ ...product, category: "APPAREL", stockQuantity: null, sizeStocks: [{ size: "M", stock: 0 }] }).success, false);
  const purchase = { productId: "existing-product", quantity: 1, fullName: "Pessoa de Teste", email: "cliente+pedido@exemplo.com.br", phone: "(11) 99999-9999", address: "Rua de Teste, 100" };
  assert.deepEqual(purchaseRequestSchema.parse(purchase), purchase);
  assert.equal(purchaseRequestSchema.parse({ ...purchase, size: " M " }).size, "M");
  for (const email of ["..@exemplo.com", ".cliente@exemplo.com", "cliente..teste@exemplo.com", "cliente@", "cliente@localhost"]) {
    assert.equal(purchaseRequestSchema.safeParse({ ...purchase, email }).success, false);
  }
  assert.equal(purchaseRequestSchema.safeParse({ ...purchase, quantity: 0 }).success, false);
  assert.equal(loginSchema.safeParse({ identifier: "admin", password: "password" }).success, true);
  assert.equal(orderStatusSchema.parse({ orderId: "existing-order", status: "NEW", notes: null }).notes, null);
});

test("patched validation preserves car form coercion and legacy image paths", () => {
  const car = { title: "Carro de teste", brand: "Marca", model: "Modelo", year: "2000", km: "1200", priceCents: "50000", description: "Descrição completa do veículo de teste",
    mods: [], features: [], tags: [], status: "AVAILABLE", isFeatured: false, whatsappLink: null, imageUrls: ["/uploads/existing-car.jpg"] };
  const result = carPayloadSchema.parse(car);
  assert.equal(result.year, 2000); assert.equal(result.km, 1200); assert.equal(result.priceCents, 50000);
  assert.equal(carPayloadSchema.safeParse({ ...car, imageUrls: ["//evil.test/image.jpg"] }).success, false);
  assert.equal(carPayloadSchema.safeParse({ ...car, year: "1949" }).success, false);
});

test("oversized galleries are rejected before accumulating an issue for every invalid element", () => {
  const result = productPayloadSchema.safeParse({ ...product, galleryUrls: Array(100_000).fill(null) });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues.length, 1);
    assert.equal(result.error.issues[0].code, "too_big");
    assert.deepEqual(result.error.issues[0].path, ["galleryUrls"]);
  }
});

test("Prisma configuration loading works with patched Effect and the reviewed deepmerge override without connecting to a database", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "ngf-prisma-config-"));
  const file = path.join(directory, "prisma.config.mjs");
  const require = createRequire(import.meta.url);
  const configModule = pathToFileURL(require.resolve("@prisma/config")).href;
  try {
    await writeFile(file, `import config from ${JSON.stringify(configModule)}; export default config.defineConfig({ schema: "schema.prisma", migrations: { path: "migrations" } });`);
    const result = await loadConfigFromFile({ configFile: file, configRoot: directory });
    assert.equal(result.error, undefined);
    assert.equal(result.config?.schema, path.join(directory, "schema.prisma"));
    assert.equal(result.config?.migrations?.path, path.join(directory, "migrations"));
  } finally { await unlink(file); await rmdir(directory); }
});
