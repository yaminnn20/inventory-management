"use client";

import { useState, useEffect } from "react";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useCreateInvoiceMutation, useGetInvoicesQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import CreateInvoiceModal from "./CreateInvoiceModal";

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: invoices, isLoading, isError, refetch } = useGetInvoicesQuery();
  const [createInvoice] = useCreateInvoiceMutation();

  const handleCreateInvoice = async (invoiceData: any) => {
    await createInvoice(invoiceData);
    refetch(); // Refetch invoices after creating a new one
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 4000);
    return () => clearInterval(intervalId);
  }, [refetch]);

  if (isLoading) return <div className="py-4">Loading...</div>;
  if (isError || !invoices)
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch invoices
      </div>
    );

  // **Filtering invoices by search term**
  const filteredInvoices = invoices?.filter((invoice) =>
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Invoices" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create Invoice
        </button>
      </div>

      {/* BODY INVOICE LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-between">
        {(filteredInvoices || []).map((invoice) => (
          <div
            key={invoice.invoiceId}
            className="border shadow-lg rounded-lg p-6 max-w-full w-full mx-auto hover:shadow-xl transition duration-300 ease-in-out"
          >
            <div className="flex flex-col space-y-4">
              <h3 className="text-2xl text-gray-900 font-semibold">
                {invoice.customerName}
              </h3>

              <div className="text-sm text-gray-600">
                <p className="mt-1">Date: {new Date(invoice.date).toLocaleDateString()}</p>
                <p className="mt-1">Products: {invoice.items}</p>
              </div>

              <div className="text-lg font-semibold text-gray-900 mt-4">
                Total: ${parseFloat(invoice.totalAmount?.toString() || "0").toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <CreateInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateInvoice}
      />
    </div>
  );
};

export default Invoices;
