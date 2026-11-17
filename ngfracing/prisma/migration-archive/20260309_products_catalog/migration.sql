-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('PART', 'APPAREL', 'ACCESSORY');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "primaryImageUrl" TEXT NOT NULL,
    "galleryJson" TEXT NOT NULL DEFAULT '[]',
    "stockQuantity" INTEGER,
    "sizeStockJson" TEXT NOT NULL DEFAULT '[]',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Migrate legacy parts into the new products catalog
INSERT INTO "Product" (
    "id",
    "name",
    "slug",
    "category",
    "description",
    "priceCents",
    "primaryImageUrl",
    "galleryJson",
    "stockQuantity",
    "sizeStockJson",
    "isFeatured",
    "createdAt",
    "updatedAt"
)
SELECT
    "id",
    "name",
    "slug",
    'PART'::"ProductCategory",
    "description",
    0,
    COALESCE(NULLIF("imageUrl", ''), '/branding/hero-car.jpg'),
    '[]',
    0,
    '[]',
    "isFeatured",
    "createdAt",
    "updatedAt"
FROM "PartItem";

-- DropForeignKey
ALTER TABLE "PartItem" DROP CONSTRAINT "PartItem_categoryId_fkey";

-- DropTable
DROP TABLE "PartCategory";

-- DropTable
DROP TABLE "PartItem";

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_category_createdAt_idx" ON "Product"("category", "createdAt");
