/*
  Warnings:

  - You are about to drop the `UserTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserTokens" DROP CONSTRAINT "UserTokens_id_fkey";

-- DropTable
DROP TABLE "UserTokens";

-- CreateTable
CREATE TABLE "UserToken" (
    "id" INTEGER NOT NULL,
    "refresh_token" TEXT,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
