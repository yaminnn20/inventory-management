-- CreateTable
CREATE TABLE "Suppliers" (
    "supplierId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalPayment" TEXT NOT NULL,
    "paymentDue" TEXT NOT NULL,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("supplierId")
);
