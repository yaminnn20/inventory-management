"use client";

import { useState, useEffect } from "react";
import { PlusCircleIcon, SearchIcon, Building2, Phone, Mail, MapPin, CreditCard, AlertCircle, PlusCircle, Upload, Download, Settings, Filter, Search } from "lucide-react";
import { useGetSuppliersQuery, useCreateSupplierMutation } from "@/state/api";
import Header from "@/app/(components)/Header";
import CreateSupplierModal from "./CreateSupplierModal";

const Suppliers = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentFilter, setPaymentFilter] = useState<"all" | "due" | "paid">("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

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
            refetch();
        } catch (error) {
            console.error("Error creating supplier:", error);
        }
    };

    const filteredSuppliers = suppliers?.filter((supplier) => {
        const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPaymentFilter = 
            paymentFilter === "all" ? true :
            paymentFilter === "due" ? supplier.paymentDue > 0 :
            supplier.paymentDue === 0;
        
        return matchesSearch && matchesPaymentFilter;
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            refetch();
        }, 4000);
        return () => clearInterval(intervalId);
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

    // Calculate supplier statistics
    const totalSuppliers = suppliers.length;
    const totalPayments = suppliers.reduce((sum, supplier) => sum + supplier.totalPayment, 0);
    const totalDue = suppliers.reduce((sum, supplier) => sum + supplier.paymentDue, 0);
    const suppliersWithDue = suppliers.filter(supplier => supplier.paymentDue > 0).length;

    return (
        <div className="mx-auto pb-5 w-full px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Suppliers</h1>
                    <p className="text-gray-600">Manage your suppliers and their details</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Supplier
                    </button>
                    <div className="hidden sm:flex items-center gap-3">
                        <button className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Import
                        </button>
                        <button className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </button>
                        <button className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </button>
                    </div>
                    <div className="sm:hidden">
                        <button className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-lg text-gray-700">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Suppliers</p>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{totalSuppliers}</h3>
                        </div>
                        <div className="bg-indigo-100 p-3 rounded-lg">
                            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Payments</p>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">${totalPayments.toLocaleString()}</h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Due</p>
                            <h3 className="text-xl sm:text-2xl font-bold text-red-600 mt-1">${totalDue.toLocaleString()}</h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pending Payments</p>
                            <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mt-1">{suppliersWithDue}</h3>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 min-w-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400 w-5 h-5" />
                    <select
                        className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm md:text-base min-w-[150px]"
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value as "all" | "due" | "paid")}
                    >
                        <option value="all">All Suppliers</option>
                        <option value="due">Payment Due</option>
                        <option value="paid">Fully Paid</option>
                    </select>
                </div>
            </div>

            {/* Supplier Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredSuppliers?.map((supplier) => (
                    <div
                        key={supplier.supplierId}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{supplier.name}</h3>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                supplier.paymentDue > 0 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-green-100 text-green-800'
                            }`}>
                                {supplier.paymentDue > 0 ? 'Payment Due' : 'All Paid'}
                            </span>
                        </div>
                        
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center text-gray-600">
                                <Phone className="w-4 h-4 mr-2" />
                                <span className="text-sm sm:text-base">{supplier.phone || 'No phone'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Mail className="w-4 h-4 mr-2" />
                                <span className="text-sm sm:text-base">{supplier.email || 'No email'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span className="text-sm sm:text-base">{supplier.address || 'No address'}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-500">Total Paid</p>
                                    <p className="text-base sm:text-lg font-semibold text-gray-900">${supplier.totalPayment.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs sm:text-sm text-gray-500">Due Amount</p>
                                    <p className="text-base sm:text-lg font-semibold text-red-600">${supplier.paymentDue.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Supplier Modal */}
            <CreateSupplierModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateSupplier}
            />
        </div>
    );
};

export default Suppliers;
