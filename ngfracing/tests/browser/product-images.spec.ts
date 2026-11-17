import { test, expect } from "@playwright/test";
import { SignJWT } from "jose";
import { AUTH_COOKIE_NAME } from "../../lib/constants";

async function token(role = "ADMIN") {
  return new SignJWT({ userId: "test-admin", email: "test@example.test", role })
    .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("10m")
    .sign(new TextEncoder().encode("ngf-local-browser-test-secret-only"));
}

test("API denies unauthenticated, invalid-role and cross-origin requests; reports missing storage", async ({ request }) => {
  const url = "/api/products/images";
  const origin = "http://localhost:3107";
  expect((await request.post(url, { headers: { origin } })).status()).toBe(401);
  expect((await request.post(url, { headers: { origin, cookie: `${AUTH_COOKIE_NAME}=${await token("CUSTOMER")}` } })).status()).toBe(401);
  expect((await request.post(url, { headers: { origin: "https://evil.test", cookie: `${AUTH_COOKIE_NAME}=${await token()}` } })).status()).toBe(403);
  const configured = await request.post(url, { headers: { origin, cookie: `${AUTH_COOKIE_NAME}=${await token()}` } });
  expect(configured.status()).toBe(503);
  expect((await configured.json()).error).toContain("não configurado");
});

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`gallery preview, upload retry, primary, order and removal at ${viewport.width}px`, async ({ page, context }, testInfo) => {
    await page.setViewportSize(viewport);
    await context.addCookies([{ name: AUTH_COOKIE_NAME, value: await token(), url: "http://localhost:3107" }]);
    await page.goto("/admin/produtos/new");
    await expect(page.getByRole("heading", { name: "Novo produto" })).toBeVisible();
    await page.getByLabel("Nome do produto").fill("Produto com fotos");
    const input = page.getByLabel("Adicionar fotos do dispositivo");
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aFh8AAAAASUVORK5CYII=", "base64");
    await input.setInputFiles([
      { name: "primeira.png", mimeType: "image/png", buffer: png },
      { name: "segunda.png", mimeType: "image/png", buffer: png }
    ]);
    const cards = page.locator(".product-image-grid > li");
    await expect(cards).toHaveCount(2);
    await expect(page.getByRole("button", { name: "Criar produto", exact: true })).toBeDisabled();
    await expect(cards.first().getByRole("img")).toHaveAttribute("src", /^blob:/);
    // Simulate one failed upload, keeping the successful image and retrying only the failed one.
    let attempts = 0;
    await page.route("**/api/products/images", async (route) => {
      attempts++;
      if (attempts === 2) return route.fulfill({ status: 500, json: { error: "Falha de teste. Tente novamente." } });
      return route.fulfill({ json: { url: `https://test-store.public.blob.vercel-storage.com/products/12345678-1234-1234-1234-${String(attempts).padStart(12, "0")}.webp` } });
    });
    await page.route("**/_next/image?**", (route) => route.fulfill({ contentType: "image/png", body: png }));
    await page.getByRole("button", { name: "Enviar imagens pendentes / tentar novamente" }).click();
    await expect(page.locator('.field-error[role="alert"]')).toContainText("Falha de teste");
    await expect(cards.first()).toContainText("Pronta para salvar");
    await page.getByRole("button", { name: "Enviar imagens pendentes / tentar novamente" }).click();
    await expect(page.getByRole("button", { name: "Criar produto", exact: true })).toBeEnabled();
    await page.locator(".product-image-manager").screenshot({ path: testInfo.outputPath("gallery.png") });
    expect(attempts).toBe(3);
    await page.getByRole("button", { name: "Usar foto 2 como principal" }).click();
    await expect(cards.first()).toContainText("Principal · segunda.png");
    await page.getByRole("button", { name: "Mover foto 1 para depois" }).click();
    await expect(cards.first()).toContainText("Principal · primeira.png");
    await page.getByRole("button", { name: "Remover foto 1 do produto" }).click();
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("Principal · segunda.png");
    await expect(page.getByLabel("Nome do produto")).toHaveValue("Produto com fotos");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    // The isolated server has no database: a failed save must preserve the form and uploaded images.
    await page.getByLabel("Preço (BRL)").fill("12500");
    await page.getByLabel("Descrição", { exact: true }).fill("Descrição de teste com várias fotos.");
    await page.getByLabel("Estoque disponível").fill("3");
    await page.getByRole("button", { name: "Criar produto", exact: true }).click();
    await expect(page.locator('.field-error[role="alert"]')).toContainText("Não foi possível salvar o produto");
    await expect(page.getByLabel("Nome do produto")).toHaveValue("Produto com fotos");
    await expect(page.getByLabel("Estoque disponível")).toHaveValue("3");
    await expect(cards).toHaveCount(1);
  });
}
