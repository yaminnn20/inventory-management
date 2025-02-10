import express from "express";
import { getSuppliers, createSupplier, getSupplierById, deleteSupplier } from "../controllers/supplierController";

const router = express.Router();

// Use "/" for the base route since you're already using "/suppliers" in the app
router.get("/", getSuppliers);
router.post("/", createSupplier);
router.get("/:id", getSupplierById);
router.delete("/:id", deleteSupplier);

export default router;