"use client";

import { useState, useEffect } from "react";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useGetSuppliersQuery, useCreateSupplierMutation } from "@/state/api";
import Header from "@/app/(components)/Header";
import CreateSupplierModal from "./CreateSupplierModal";

const Suppliers = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data: suppliers,
        isLoading,
        isError,
        refetch,
    } = useGetSuppliersQuery();

    const [createSupplier] = useCreateSupplierMutation();

    const handleCreateSupplier = async (supplierData: any) => {
        try {
            const result = await createSupplier(supplierData).unwrap();
            console.log("Supplier created:", result);
            setIsModalOpen(false);
            refetch(); // Refetch immediately after successful creation
        } catch (error) {
            console.error("Error creating supplier:", error);
            // Handle error (e.g., display an error message)
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            refetch(); // Regularly trigger refetch every 3 seconds
        }, 4000);

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [refetch]);

    if (isLoading && !suppliers) {
        return <div className="py-4">Loading...</div>;
    }

    if (isError) {
        return (
            <div className="text-center text-red-500 py-4">
                Failed to fetch suppliers
            </div>
        );
    }

    if (!suppliers) {
        return <div>No suppliers found.</div>;
    }

    return (
        <div className="mx-auto pb-5 w-full">
            {/* SEARCH BAR */}
            <div className="mb-6">
                <div className="flex items-center border-2 border-gray-200 rounded">
                    <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
                    <input
                        className="w-full py-2 px-4 rounded bg-white"
                        placeholder="Search suppliers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* HEADER BAR */}
            <div className="flex justify-between items-center mb-6">
                <Header name="Suppliers" />
                <button
                    className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Add Supplier
                </button>
            </div>

            {/* BODY SUPPLIER LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.map((supplier) => (
                    <div
                        key={supplier.supplierId}
                        className="border shadow rounded-md p-6 bg-white hover:shadow-lg transition duration-300 h-full flex flex-col"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl text-gray-900 font-semibold mb-2">
                                    {supplier.name}
                                </h3>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-800 font-medium">
                                    Total: ${supplier.totalPayment}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Due: ${supplier.paymentDue}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            <CreateSupplierModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateSupplier}
            />
        </div>
    );
};

export default Suppliers;
