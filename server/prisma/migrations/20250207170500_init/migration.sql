/*
  Warnings:

  - The primary key for the `Suppliers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Suppliers` table. All the data in the column will be lost.
  - Added the required column `supplierId` to the `Suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Suppliers" DROP CONSTRAINT "Suppliers_pkey",
DROP COLUMN "userId",
ADD COLUMN     "supplierId" TEXT NOT NULL,
ADD CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("supplierId");
