import assert from "node:assert/strict";
import { test } from "node:test";
import sharp from "sharp";
import { MAX_PRODUCT_IMAGE_SIZE, isProductBlobUrl, moveProductImage, validateProductImageFile } from "../lib/product-images";
import { prepareProductImage, readImageFormData } from "../lib/product-image-upload";
import { assertKnownProductImages } from "../lib/product-image-selection";
import { productPayloadSchema } from "../lib/validators";

test("rejects empty, oversized and active/non-image formats", () => {
  for (const type of ["image/svg+xml", "text/html", "application/pdf", "image/gif"]) {
    assert.ok(validateProductImageFile({ size: 100, type }));
  }
  assert.ok(validateProductImageFile({ size: 0, type: "image/jpeg" }));
  assert.ok(validateProductImageFile({ size: MAX_PRODUCT_IMAGE_SIZE + 1, type: "image/jpeg" }));
  assert.equal(validateProductImageFile({ size: MAX_PRODUCT_IMAGE_SIZE, type: "image/jpeg" }), null);
});

test("decodes supported formats, strips metadata and produces a bounded WebP", async () => {
  for (const format of ["jpeg", "png", "webp", "avif"] as const) {
    const bytes = await sharp({ create: { width: 2500, height: 100, channels: 3, background: "red" } })
      .withMetadata().toFormat(format).toBuffer();
    const prepared = await prepareProductImage(new File([new Uint8Array(bytes)], `photo.${format}`, { type: `image/${format}` }));
    const metadata = await sharp(prepared.bytes).metadata();
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.width, 2400);
    assert.equal(metadata.exif, undefined);
    assert.equal(prepared.width, metadata.width);
    assert.equal(prepared.height, metadata.height);
  }
});

test("rejects forged MIME, SVG disguised as PNG, truncated image and excessive pixels", async () => {
  const jpeg = await sharp({ create: { width: 8, height: 8, channels: 3, background: "red" } }).jpeg().toBuffer();
  const huge = await sharp({ create: { width: 6500, height: 6500, channels: 3, background: "red" } }).png().toBuffer();
  for (const bytes of [jpeg, Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'), jpeg.subarray(0, 30), huge]) {
    await assert.rejects(prepareProductImage(new File([new Uint8Array(bytes)], "image.png", { type: "image/png" })));
  }
});

test("only trusts the exact store, managed path and HTTPS URLs", () => {
  const host = "ngf.public.blob.vercel-storage.com";
  const pathname = "/products/12345678-1234-1234-1234-123456789012.webp";
  assert.equal(isProductBlobUrl(`https://${host}${pathname}`, host), true);
  for (const value of [`http://${host}${pathname}`, `https://${host}.evil.com${pathname}`,
    `https://evil.com${pathname}`, `https://user@${host}${pathname}`, `https://${host}:8080${pathname}`,
    `https://${host}${pathname}?foo=1`, `https://${host}${pathname}#x`, `https://${host}/other/image.webp`]) {
    assert.equal(isProductBlobUrl(value, host), false, value);
  }
  assert.equal(isProductBlobUrl(`https://${host}${pathname}`, ""), false);
});

test("changing primary and ordering preserves all images without mutating the original", () => {
  const original = ["legacy", "blob1", "blob2"];
  assert.deepEqual(moveProductImage(original, 2, 0), ["blob2", "legacy", "blob1"]);
  assert.deepEqual(moveProductImage(original, 0, 1), ["blob1", "legacy", "blob2"]);
  assert.deepEqual(moveProductImage(original, 0, -1), original);
  assert.deepEqual(original, ["legacy", "blob1", "blob2"]);
});

test("accepts verified assets, shared assets, repository and existing legacy URLs only", () => {
  const existing = { primaryImageUrl: "/uploads/legacy.jpg", galleryJson: '["/old/gallery.png"]' };
  assert.doesNotThrow(() => assertKnownProductImages(
    ["/uploads/legacy.jpg", "/old/gallery.png", "/images/produtos/a.png", "https://store/shared.webp"],
    ["/images/produtos/a.png"], ["https://store/shared.webp"], existing));
  assert.throws(() => assertKnownProductImages(["https://store/unconfirmed.webp"], [], [], existing), /UNKNOWN_PRODUCT_IMAGE/);
  assert.throws(() => assertKnownProductImages(["/arbitrary/path.jpg"], [], [], null), /UNKNOWN_PRODUCT_IMAGE/);
});

test("product schema preserves local compatibility and gallery bounds", () => {
  const payload = { name: "Produto", category: "PART", description: "Descrição do produto", priceCents: 100,
    primaryImageUrl: "/uploads/legacy.jpg", galleryUrls: [], stockQuantity: 1, sizeStocks: [], isFeatured: false };
  assert.ok(productPayloadSchema.safeParse(payload).success);
  for (const primaryImageUrl of ["//evil.test/a.png", "/../secret", "javascript:alert(1)", "https://evil.test/a.jpg"]) {
    assert.equal(productPayloadSchema.safeParse({ ...payload, primaryImageUrl }).success, false);
  }
  assert.equal(productPayloadSchema.safeParse({ ...payload, galleryUrls: Array(9).fill("/a.png") }).success, false);
});

test("reads valid multipart without trusting client Content-Length", async () => {
  const form = new FormData();
  form.append("file", new File(["image bytes"], "photo.jpg", { type: "image/jpeg" }));
  const request = new Request("http://localhost/api/products/images", { method: "POST", body: form });
  const parsed = await readImageFormData(request);
  assert.equal((parsed.get("file") as File).name, "photo.jpg");
});

test("rejects oversized streamed requests, declared oversize and malformed multipart", async () => {
  const headers = { "content-type": "multipart/form-data; boundary=images" };
  await assert.rejects(readImageFormData(new Request("http://localhost", {
    method: "POST", headers: { ...headers, "content-length": "9999999" }, body: "x"
  })), { status: 413 });
  await assert.rejects(readImageFormData(new Request("http://localhost", {
    method: "POST", headers, body: new Uint8Array(MAX_PRODUCT_IMAGE_SIZE + 65537)
  })), { status: 413 });
  await assert.rejects(readImageFormData(new Request("http://localhost", { method: "POST", headers, body: "broken" })));
});
