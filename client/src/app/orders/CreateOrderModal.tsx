import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

interface OrderFormData {
  name: string;
  totalAmount: number;
  items: string;
  status: string;
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: OrderFormData) => void;
}

const CreateOrderModal = ({ isOpen, onClose, onCreate }: CreateOrderModalProps) => {
  const [formData, setFormData] = useState({
    orderId: v4(),
    name: "",
    totalAmount: 0,
    items: "",
    status: "Pending",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "totalAmount" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Order" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* NAME */}
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            onChange={handleChange}
            value={formData.name}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* TOTAL AMOUNT */}
          <label className="block text-sm font-medium text-gray-700">Total Amount</label>
          <input
            type="number"
            name="totalAmount"
            placeholder="Total Amount"
            onChange={handleChange}
            value={formData.totalAmount}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* ITEMS */}
          <label className="block text-sm font-medium text-gray-700">Items</label>
          <textarea
            name="items"
            placeholder="List items (comma-separated)"
            onChange={handleChange}
            value={formData.items}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* STATUS */}
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <input
            type="text"
            name="status"
            placeholder="Status (e.g., Pending, Shipped, Delivered)"
            onChange={handleChange}
            value={formData.status}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* ACTION BUTTONS */}
          <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            Create
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;