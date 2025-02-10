import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all invoices (optional search by customer name)
export const getInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const invoices = await prisma.invoices.findMany({
      where: search
        ? {
            customerName: {
              contains: search,
              mode: "insensitive", // Case-insensitive search
            },
          }
        : {},
      orderBy: { date: "desc" }, // Latest invoices first
    });
    res.json(invoices);
  } catch (error) {
    console.error("Error retrieving invoices:", error);
    res.status(500).json({ message: "Error retrieving invoices" });
  }
};

// Create a new invoice
export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, date, totalAmount, items } = req.body;
    if (!customerName || !date || !totalAmount || !items) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const invoice = await prisma.invoices.create({
      data: {
        invoiceId: crypto.randomUUID(),
        customerName,
        date,
        totalAmount,
        items,
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "Error creating invoice" });
  }
};

// Get a single invoice by ID
export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoices.findUnique({
      where: { invoiceId: id },
    });

    if (!invoice) {
      res.status(404).json({ message: "Invoice not found" });
      return;
    }

    res.json(invoice);
  } catch (error) {
    console.error("Error retrieving invoice:", error);
    res.status(500).json({ message: "Error retrieving invoice" });
  }
};

// Delete an invoice by ID
export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoices.delete({
      where: { invoiceId: id },
    });

    res.json({ message: "Invoice deleted successfully", invoice });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ message: "Error deleting invoice" });
  }
};
