import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "@/app/(components)/Header";

type SupplierFormData = {
  supplierId: string;
  name: string;
  totalPayment: number;
  paymentDue: number;
};

type CreateSupplierModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: SupplierFormData) => void;
};

const CreateSupplierModal = ({ isOpen, onClose, onCreate }: CreateSupplierModalProps) => {
  const [formData, setFormData] = useState<SupplierFormData>({
    supplierId: uuidv4(),
    name: "",
    totalPayment: 0,
    paymentDue: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
        <Header name="Create New Supplier" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* Supplier Name */}
          <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Total Payment */}
          <label className="block text-sm font-medium text-gray-700">Total Payment</label>
          <input
            type="number"
            name="totalPayment"
            placeholder="Total Payment"
            onChange={handleChange}
            value={formData.totalPayment}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Payment Due */}
          <label className="block text-sm font-medium text-gray-700">Payment Due</label>
          <input
            type="number"
            name="paymentDue"
            placeholder="Payment Due"
            onChange={handleChange}
            value={formData.paymentDue}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Buttons */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
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

export default CreateSupplierModal;
