/*
  Warnings:

  - Added the required column `cost` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "cost" DECIMAL(8,2) NOT NULL;
