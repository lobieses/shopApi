-- AlterTable
ALTER TABLE "Products" RENAME COLUMN "userId" TO "selerId";
ALTER TABLE "Products" ADD COLUMN "sellerName" TEXT NOT NULL DEFAULT 'gigachad';