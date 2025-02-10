/*
  Warnings:

  - The `items` column on the `Invoices` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Invoices" ALTER COLUMN "date" SET DATA TYPE TEXT,
DROP COLUMN "items",
ADD COLUMN     "items" TEXT[];
