-- CreateTable
CREATE TABLE "Invoices" (
    "invoiceId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "items" TEXT NOT NULL,

    CONSTRAINT "Invoices_pkey" PRIMARY KEY ("invoiceId")
);

-- CreateTable
CREATE TABLE "Orders" (
    "orderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "items" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("orderId")
);
