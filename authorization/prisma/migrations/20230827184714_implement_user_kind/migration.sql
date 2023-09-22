-- CreateEnum
CREATE TYPE "UserKind" AS ENUM ('salesman', 'buyer');

-- AlterTable
ALTER TABLE "JwtTokens" RENAME CONSTRAINT "UserToken_pkey" TO "JwtTokens_pkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "kind" "UserKind" NOT NULL DEFAULT 'buyer';

-- RenameForeignKey
ALTER TABLE "JwtTokens" RENAME CONSTRAINT "UserToken_id_fkey" TO "JwtTokens_id_fkey";
