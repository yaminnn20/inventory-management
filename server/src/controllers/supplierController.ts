import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();



// Get all suppliers (optional search by name)
export const getSuppliers = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search?.toString();
        const suppliers = await prisma.suppliers.findMany({
            where: search
                ? {
                    name: {
                        contains: search,
                        mode: "insensitive", // Case-insensitive search
                    },
                }
                : {},
            orderBy: { name: "asc" }, // Sorting suppliers alphabetically
        });

        res.json(suppliers);
    } catch (error) {
        console.error("Error retrieving suppliers:", error);
        res.status(500).json({ message: "Error retrieving suppliers" });
    }
};

// Create a new supplier
export const createSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("🟢 Received supplier data:", req.body);
        const { name, totalPayment, paymentDue } = req.body;

        const totalPaymentNum = Number(totalPayment);
        const paymentDueNum = Number(paymentDue);

        // Ensure all required fields are provided
        if (!name || !totalPayment || !paymentDue) {
           res.status(400).json({ message: "Missing required fields" });
           return;
        }

        // Log the received values for debugging
        console.log(`Creating supplier: Name: ${name}, TotalPayment: ${totalPayment}, PaymentDue: ${paymentDue}`);

        // Create the supplier using the provided data
        const supplier = await prisma.suppliers.create({
            data: {
                
                supplierId: crypto.randomUUID(), // Generate a unique userId (UUID)
                name,
                totalPayment: totalPaymentNum, // Use the converted number
                paymentDue: paymentDueNum,    // Use the converted number
            },
        });

        res.status(201).json(supplier);
    } catch (error) {
        console.error("Error creating supplier:", error);
        res.status(500).json({ message: "Error creating supplier" });
    }
};

// Get a single supplier by ID
export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // Get the supplier ID from URL parameters
        const supplier = await prisma.suppliers.findUnique({
            where: { supplierId: id }, // Use 'userId' for the primary key
        });

        if (!supplier) {
             res.status(404).json({ message: "Supplier not found" });
             return;
        }

        res.json(supplier);
    } catch (error) {
        console.error("Error retrieving supplier:", error);
        res.status(500).json({ message: "Error retrieving supplier" });
    }
};

// Delete a supplier by ID
export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // Get the supplier ID from URL parameters
        const supplier = await prisma.suppliers.delete({
            where: { supplierId: id }, // Use 'userId' for the primary key
        });

        res.json({ message: "Supplier deleted successfully", supplier });
    } catch (error) {
        console.error("Error deleting supplier:", error);
        res.status(500).json({ message: "Error deleting supplier" });
        
    }
};
