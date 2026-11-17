import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  use: { baseURL: "http://localhost:3107", headless: true, trace: "retain-on-failure" },
  webServer: {
    command: "npm run dev -- --port 3107",
    url: "http://localhost:3107/admin/login",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      JWT_SECRET: "ngf-local-browser-test-secret-only",
      ADMIN_USER: "test-admin", ADMIN_PASSWORD: "local-test-password",
      NEXT_PUBLIC_BASE_URL: "http://localhost:3107",
      POSTGRES_PRISMA_URL: "postgresql://test:test@localhost:1/test?connect_timeout=1",
      POSTGRES_URL_NON_POOLING: "postgresql://test:test@localhost:1/test?connect_timeout=1",
      BLOB_READ_WRITE_TOKEN: "",
      BLOB_PUBLIC_HOSTNAME: "test-store.public.blob.vercel-storage.com"
    }
  }
});
