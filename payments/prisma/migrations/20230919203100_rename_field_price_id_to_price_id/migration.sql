/*
  Warnings:

  - You are about to drop the column `price_id` on the `PreparedLots` table. All the data in the column will be lost.
  - Added the required column `priceId` to the `PreparedLots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PreparedLots" DROP COLUMN "price_id",
ADD COLUMN     "priceId" TEXT NOT NULL;
