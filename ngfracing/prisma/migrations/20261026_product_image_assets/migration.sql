BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

CREATE TABLE "ProductImageAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductImageAsset_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ProductImageAsset_url_key" ON "ProductImageAsset"("url");
CREATE UNIQUE INDEX "ProductImageAsset_pathname_key" ON "ProductImageAsset"("pathname");
CREATE INDEX "ProductImageAsset_uploadedBy_createdAt_idx" ON "ProductImageAsset"("uploadedBy", "createdAt");

COMMIT;
