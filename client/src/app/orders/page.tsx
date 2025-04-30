"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  PackageCheck,
  Truck,
  Clock,
  ShoppingCart,
  ArrowUpRight,
  CalendarDays,
  BarChart3,
  ListFilter,
} from "lucide-react";
import { useGetOrdersQuery, useCreateOrderMutation, Order as APIOrder } from "@/state/api";
import CreateOrderModal from "./CreateOrderModal";
import CreateShipmentModal from "./CreateShipmentModal";

interface OrderWithStatus extends APIOrder {
  status: 'preparing' | 'delivered' | 'completed' | 'pending';
}

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useGetOrdersQuery(searchTerm);

  const [createOrder] = useCreateOrderMutation();

  const handleCreateOrder = async (orderData: any) => {
    try {
      await createOrder(orderData).unwrap();
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleCreateShipment = async (shipmentData: any) => {
    try {
      // TODO: Implement shipment creation API call
      console.log('Creating shipment:', shipmentData);
      setIsShipmentModalOpen(false);
      // Optionally refresh orders after shipment creation
      refetch();
    } catch (error) {
      console.error('Failed to create shipment:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(refetch, 4000);
    return () => clearInterval(intervalId);
  }, [refetch]);

  const getOrderStatus = (order: any): OrderWithStatus['status'] => {
    const status = order.status?.toLowerCase() || '';
    if (status.includes('delivered')) return 'delivered';
    if (status.includes('completed')) return 'completed';
    if (status.includes('preparing')) return 'preparing';
    return 'pending';
  };

  const getStatusIcon = (status: OrderWithStatus['status']) => {
    switch (status) {
      case "delivered":
        return <Truck className="w-4 h-4" />;
      case "completed":
        return <PackageCheck className="w-4 h-4" />;
      case "preparing":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <ShoppingCart className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: OrderWithStatus['status']) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-50";
      case "completed":
        return "text-blue-600 bg-blue-50";
      case "preparing":
        return "text-yellow-600 bg-yellow-50";
      case "pending":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredOrders = orders.map(order => ({
    ...order,
    status: getOrderStatus(order)
  })).filter((order) => {
    const statusMatch =
      selectedStatus === "all" || order.status === selectedStatus;
    const searchMatch =
      order.name.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Calculate summary statistics
  const summaryStats = {
    total: filteredOrders
      .reduce((sum, order) => sum + order.totalAmount, 0),
    delivered: filteredOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0),
    completed: filteredOrders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0),
    preparing: filteredOrders
      .filter(order => order.status === 'preparing')
      .reduce((sum, order) => sum + order.totalAmount, 0),
    pending: filteredOrders
      .filter(order => order.status === 'pending')
      .reduce((sum, order) => sum + order.totalAmount, 0),
  };

  if (isLoading) return <div className="py-4">Loading...</div>;
  if (isError) return <div className="text-center text-red-500 py-4">Failed to fetch orders</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Orders Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600">Track and manage your orders efficiently</p>
        </div>
        <div className="flex flex-wrap w-full sm:w-auto gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm text-sm md:text-base"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            Create Order
          </button>
          <button
            onClick={() => setIsShipmentModalOpen(true)}
            className="flex-1 sm:flex-none bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-sm text-sm md:text-base"
          >
            <Truck className="w-4 h-4 md:w-5 md:h-5" />
            Shipment
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-xs md:text-sm text-gray-500">Total Revenue</h3>
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
          </div>
          <p className="text-lg md:text-2xl font-bold text-gray-900">
            ${summaryStats.total.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-xs md:text-sm text-gray-500">Delivered</h3>
            <Truck className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
          </div>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{summaryStats.delivered}</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-xs md:text-sm text-gray-500">Completed</h3>
            <PackageCheck className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
          </div>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{summaryStats.completed}</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-xs md:text-sm text-gray-500">Preparing</h3>
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
          </div>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{summaryStats.preparing}</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-xs md:text-sm text-gray-500">Pending</h3>
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
          </div>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{summaryStats.pending}</p>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          <input
              type="text"
            placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Filter className="text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <select
              className="bg-transparent border-none focus:ring-0 text-gray-600 text-sm md:text-base pr-8"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="preparing">Preparing</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="flex bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            >
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </button>
        <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
        >
              <ListFilter className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredOrders.map((order) => (
          <div
            key={order.orderId}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">{order.name}</h3>
                <span className={`px-2.5 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {formatStatusText(order.status)}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-xs md:text-sm text-gray-600">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  {new Date().toLocaleDateString()}
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  <p className="line-clamp-2">{order.items}</p>
                </div>
                <div className="flex justify-between items-center pt-3 md:pt-4 border-t border-gray-100">
                  <span className="font-semibold text-gray-900 text-sm md:text-base">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
                    View Details
                    <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Name</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Items</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900">{order.name}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 max-w-xs truncate hidden md:table-cell">{order.items}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {formatStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
      )}

      <CreateOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateOrder}
      />
      
      <CreateShipmentModal
        isOpen={isShipmentModalOpen}
        onClose={() => setIsShipmentModalOpen(false)}
        onCreateShipment={handleCreateShipment}
      />
    </div>
  );
};

export default Orders;
