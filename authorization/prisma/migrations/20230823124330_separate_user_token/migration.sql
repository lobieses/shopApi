/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "refresh_token";

-- CreateTable
CREATE TABLE "UserTokens" (
    "id" INTEGER NOT NULL,
    "refresh_token" TEXT,

    CONSTRAINT "UserTokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserTokens" ADD CONSTRAINT "UserTokens_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
