/*
  Warnings:

  - Changed the type of `totalPayment` on the `Suppliers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paymentDue` on the `Suppliers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Suppliers" DROP COLUMN "totalPayment",
ADD COLUMN     "totalPayment" DOUBLE PRECISION NOT NULL,
DROP COLUMN "paymentDue",
ADD COLUMN     "paymentDue" DOUBLE PRECISION NOT NULL;
