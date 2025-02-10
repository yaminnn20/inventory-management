import { Router } from "express";
import { createOrder, getOrders, getOrderById, deleteOrder } from "../controllers/orderController";

const router = Router();

router.get("/", getOrders); // Get all orders
router.post("/", createOrder); // Create a new order
router.get("/:id", getOrderById); // Get a specific order by ID
router.delete("/:id", deleteOrder); // Delete an order by ID

export default router;
