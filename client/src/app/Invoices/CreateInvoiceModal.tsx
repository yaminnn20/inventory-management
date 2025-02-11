import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

interface InvoiceFormData {
  customerName: string;
  date: string;
  totalAmount: number;
  items: string;
}

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: InvoiceFormData) => void;
}

const CreateInvoiceModal = ({ isOpen, onClose, onCreate }: CreateInvoiceModalProps) => {
  const [formData, setFormData] = useState({
    invoiceId: v4(),
    customerName: "",
    date: new Date().toISOString().split("T")[0],  // Default date in YYYY-MM-DD format
    totalAmount: 0,
    items: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalAmount" ? (value === "" ? 0 : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      date: new Date(formData.date).toISOString(), // Ensure ISO format
    };

    console.log("Submitting invoice form data:", updatedFormData); // Debugging log
    onCreate(updatedFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Invoice" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* CUSTOMER NAME */}
          <label className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            onChange={handleChange}
            value={formData.customerName}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* DATE */}
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            onChange={handleChange}
            value={formData.date}
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
            value={formData.totalAmount.toString()}  // Ensures it is a string
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

export default CreateInvoiceModal;
