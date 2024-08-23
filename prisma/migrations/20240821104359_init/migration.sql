/*
  Warnings:

  - A unique constraint covering the columns `[providerAccountId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerAccountId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "providerAccountId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_providerAccountId_key" ON "User"("providerAccountId");
