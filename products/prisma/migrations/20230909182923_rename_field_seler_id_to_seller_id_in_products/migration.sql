/*
  Warnings:

  - You are about to drop the column `selerId` on the `Products` table. All the data in the column will be lost.
  - Added the required column `sellerId` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "selerId",
ADD COLUMN     "sellerId" INTEGER NOT NULL;
