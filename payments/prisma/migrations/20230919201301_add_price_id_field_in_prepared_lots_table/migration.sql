/*
  Warnings:

  - Added the required column `price_id` to the `PreparedLots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PreparedLots" ADD COLUMN     "price_id" TEXT NOT NULL;
