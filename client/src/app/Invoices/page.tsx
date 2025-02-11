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
    try {
      await createInvoice(invoiceData).unwrap(); // Use unwrap to handle errors
      refetch();
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice. Please try again."); // User-friendly error message
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 4000);
    return () => clearInterval(intervalId);
  }, [refetch]);

  if (isLoading) return <div className="py-4">Loading...</div>;

  if (isError) { // Simplified isError check
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch invoices. Please check your network connection or try again later.
      </div>
    );
  }

  if (!invoices) { // Handle the case where invoices is still null after loading
      return <div className="text-center py-4">No invoices found.</div>
  }



  const filteredInvoices = invoices.filter((invoice) => {
    const customerName = invoice?.customerName?.toLowerCase(); // Optional chaining
    return customerName?.includes(searchTerm.toLowerCase()) ?? false; // Nullish coalescing
  });

  return (
    <div className="mx-auto pb-5 w-full">
      {/* ... (search bar and header bar remain the same) */}

      {/* BODY INVOICE LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-between">
        {filteredInvoices.map((invoice) => ( // No need for || [] anymore
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
                Total: ${Number(invoice.totalAmount ?? 0).toFixed(2)} {/* Safe formatting */}
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