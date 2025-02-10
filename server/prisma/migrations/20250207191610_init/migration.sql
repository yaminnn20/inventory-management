-- CreateTable
CREATE TABLE "Orders" (
    "orderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalAmount" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("orderId")
);
