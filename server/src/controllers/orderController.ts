import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all orders (optional search by customer name)
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const orders = await prisma.orders.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive", // Case-insensitive search
            },
          }
        : {},
      
    });
    res.json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ message: "Error retrieving orders" });
  }
};

// Create a new order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, totalAmount, items, status } = req.body;
    if (!name || !totalAmount || !items || !status) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const order = await prisma.orders.create({
      data: {
        orderId: crypto.randomUUID(),
        name,
        totalAmount,
        items,
        status, // or any default status value
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

// Get a single order by ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await prisma.orders.findUnique({
      where: { orderId: id },
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error("Error retrieving order:", error);
    res.status(500).json({ message: "Error retrieving order" });
  }
};

// Delete an order by ID
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await prisma.orders.delete({
      where: { orderId: id },
    });

    res.json({ message: "Order deleted successfully", order });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order" });
  }
};