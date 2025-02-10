import { Router } from "express";
import { createInvoice, getInvoices, getInvoiceById, deleteInvoice } from "../controllers/invoiceController";

const router = Router();

router.get("/", getInvoices); // Get all invoices
router.post("/", createInvoice); // Create a new invoice
router.get("/:id", getInvoiceById); // Get a specific invoice by ID
router.delete("/:id", deleteInvoice); // Delete an invoice by ID

export default router;
