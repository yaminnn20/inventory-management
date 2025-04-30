"use client";

import { useState, useEffect } from "react";
import {
  Printer,
  Send,
  Download,
  Plus,
  Clipboard,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  PlusCircle,
  FileText,
  Eye,
  FileDown,
} from "lucide-react";
import { useCreateInvoiceMutation, useGetInvoicesQuery } from "@/state/api";
import CreateInvoiceModal from "./CreateInvoiceModal";
import type { Invoice as APIInvoice, NewInvoice } from "@/state/api";
import Header from "@/app/(components)/Header";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

// Add type augmentation for jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

interface InvoiceWithStatus extends APIInvoice {
  status: 'paid' | 'pending' | 'draft';
}

interface InvoiceFormData {
  customerName: string;
  totalAmount: number;
  date: string;
  items: string;
}

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithStatus | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const {
    data: invoices = [],
    isLoading,
    isError,
    refetch,
  } = useGetInvoicesQuery(searchTerm);

  const [createInvoice] = useCreateInvoiceMutation();

  const handleCreateInvoice = async (formData: InvoiceFormData) => {
    try {
      const newInvoice: NewInvoice = {
        customerName: formData.customerName,
        date: formData.date,
        totalAmount: formData.totalAmount,
        items: formData.items
      };
      
      await createInvoice(newInvoice).unwrap();
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(refetch, 4000);
    return () => clearInterval(intervalId);
  }, [refetch]);

  const getInvoiceStatus = (invoice: APIInvoice): InvoiceWithStatus['status'] => {
    // You might want to implement your own logic here based on your business rules
    // For example, based on payment date, due date, or other factors
    const items = invoice.items.split(',');
    if (items.some(item => item.includes('paid'))) return 'paid';
    if (items.some(item => item.includes('pending'))) return 'pending';
    return 'draft';
  };

  const filteredInvoices = invoices.map(invoice => ({
    ...invoice,
    status: getInvoiceStatus(invoice)
  })).filter((invoice) => {
    const statusMatch =
      selectedStatus === "all" || invoice.status === selectedStatus;
    const searchMatch =
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const getStatusIcon = (status: InvoiceWithStatus['status']) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "draft":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: InvoiceWithStatus['status']) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "draft":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatStatusText = (status: InvoiceWithStatus['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Calculate summary statistics
  const summaryStats = {
    paid: filteredInvoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.totalAmount, 0),
    pending: filteredInvoices
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.totalAmount, 0),
    draft: filteredInvoices
      .filter(inv => inv.status === 'draft')
      .reduce((sum, inv) => sum + inv.totalAmount, 0),
  };

  const handleViewPdf = (invoice: InvoiceWithStatus) => {
    setSelectedInvoice(invoice);
    setIsPdfModalOpen(true);
  };

  const handleDownloadPdf = (invoice: InvoiceWithStatus) => {
    // Create PDF document
    const doc = new jsPDF();
    
    // Add company logo or name
    doc.setFontSize(40);
    doc.setTextColor(60, 60, 60);
    doc.text("INVOICE", 140, 40, { align: "right" });
    
    // Add line under the header
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 45, 190, 45);
    
    // Add invoice details section
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("INVOICE NO:", 140, 60);
    doc.text("DATE:", 140, 70);
    doc.text("DUE DATE:", 140, 80);
    
    doc.setTextColor(60, 60, 60);
    doc.text(invoice.invoiceId, 190, 60, { align: "right" });
    doc.text(new Date(invoice.date).toLocaleDateString(), 190, 70, { align: "right" });
    doc.text(new Date(new Date(invoice.date).getTime() + 30*24*60*60*1000).toLocaleDateString(), 190, 80, { align: "right" });
    
    // Add billing details
    doc.setTextColor(100, 100, 100);
    doc.text("ISSUED TO:", 20, 60);
    doc.setTextColor(60, 60, 60);
    doc.text(invoice.customerName, 20, 70);
    doc.text("123 Client Street", 20, 80);
    doc.text("City, Country", 20, 90);
    
    // Add payment details
    doc.setTextColor(100, 100, 100);
    doc.text("PAY TO:", 20, 110);
    doc.setTextColor(60, 60, 60);
    doc.text("Your Company Bank", 20, 120);
    doc.text("Account Name: Your Company", 20, 130);
    doc.text("Account No.: XXXX-XXXX-XXXX", 20, 140);
    
    // Add items table
    const items = invoice.items.split(',').map(item => item.trim());
    const tableData = items.map(item => [
      item,
      "$100.00",
      "1",
      "$100.00"
    ]);

    // Add table using autoTable
    autoTable(doc, {
      startY: 160,
      head: [["DESCRIPTION", "UNIT PRICE", "QTY", "TOTAL"]],
      body: tableData,
      theme: 'plain',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [100, 100, 100],
        fontSize: 10,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
        textColor: [60, 60, 60],
        cellPadding: 5,
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 30, halign: 'right' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
      },
    });
    
    // Get the last Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY || 200;
    
    // Add totals
    doc.setDrawColor(220, 220, 220);
    doc.line(20, finalY + 10, 190, finalY + 10);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("SUBTOTAL", 140, finalY + 20);
    doc.text("TAX (10%)", 140, finalY + 30);
    doc.text("TOTAL", 140, finalY + 40);
    
    doc.setTextColor(60, 60, 60);
    const subtotal = invoice.totalAmount / 1.1;
    const tax = invoice.totalAmount - subtotal;
    doc.text(`$${subtotal.toFixed(2)}`, 190, finalY + 20, { align: "right" });
    doc.text(`$${tax.toFixed(2)}`, 190, finalY + 30, { align: "right" });
    doc.text(`$${invoice.totalAmount.toFixed(2)}`, 190, finalY + 40, { align: "right" });
    
    // Save the PDF
    doc.save(`invoice-${invoice.invoiceId}.pdf`);
  };

  if (isLoading) return <div className="py-4">Loading...</div>;
  if (isError) return <div className="text-center text-red-500 py-4">Failed to fetch invoices</div>;

    return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invoices</h1>
          <p className="text-gray-600">Manage and track your invoices</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors text-sm md:text-base"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            New Invoice
          </button>
          <button className="bg-white text-gray-700 px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 border hover:bg-gray-100 text-sm md:text-base">
            <Printer className="w-4 h-4 md:w-5 md:h-5" /> Print
          </button>
          <button className="bg-white text-gray-700 px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 border hover:bg-gray-100 text-sm md:text-base">
            <Download className="w-4 h-4 md:w-5 md:h-5" /> Export
          </button>
          <button className="bg-white text-gray-700 px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 border hover:bg-gray-100 text-sm md:text-base">
            <Send className="w-4 h-4 md:w-5 md:h-5" /> Send
          </button>
          <button className="bg-white text-gray-700 px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 border hover:bg-gray-100 text-sm md:text-base">
            <Clipboard className="w-4 h-4 md:w-5 md:h-5" /> Quote
          </button>
        </div>
      </div>

      {/* Invoice Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-700">Paid Invoices</h3>
              <p className="text-lg md:text-xl font-bold text-green-600">$0.00</p>
            </div>
            <div className="bg-green-100 p-2 md:p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-700">Pending Invoices</h3>
              <p className="text-lg md:text-xl font-bold text-yellow-600">$0.00</p>
            </div>
            <div className="bg-yellow-100 p-2 md:p-3 rounded-lg">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-700">Draft Invoices</h3>
              <p className="text-lg md:text-xl font-bold text-blue-600">$168,940.75</p>
            </div>
            <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
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
            placeholder="Search invoices..."
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Invoices</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Date</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Items</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.invoiceId} className="hover:bg-gray-50">
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.customerName}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${invoice.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-gray-500 max-w-xs truncate hidden lg:table-cell">
                    {invoice.items}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {formatStatusText(invoice.status)}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewPdf(invoice)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="View PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(invoice)}
                        className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                        title="Download PDF"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
              </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
      </div>

      <CreateInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateInvoice}
      />
    </div>
  );
};

export default Invoices;
