/*
  Warnings:

  - You are about to drop the column `productId` on the `Invoices` table. All the data in the column will be lost.
  - Added the required column `items` to the `Invoices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invoices" DROP CONSTRAINT "Invoices_productId_fkey";

-- AlterTable
ALTER TABLE "Invoices" DROP COLUMN "productId",
ADD COLUMN     "items" TEXT NOT NULL;
