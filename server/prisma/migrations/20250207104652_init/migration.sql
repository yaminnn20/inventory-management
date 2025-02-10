/*
  Warnings:

  - You are about to drop the `InvoiceItems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `Invoices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InvoiceItems" DROP CONSTRAINT "InvoiceItems_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceItems" DROP CONSTRAINT "InvoiceItems_productId_fkey";

-- AlterTable
ALTER TABLE "Invoices" ADD COLUMN     "productId" TEXT NOT NULL;

-- DropTable
DROP TABLE "InvoiceItems";

-- CreateTable
CREATE TABLE "Suppliers" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalpayment" TEXT NOT NULL,
    "paymentdue" TEXT NOT NULL,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
