"use client";

import { useState, useEffect } from "react";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useGetOrdersQuery, useCreateOrderMutation } from "@/state/api";
import Header from "@/app/(components)/Header";
import CreateOrderModal from "./CreateOrderModal";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: orders,
    isLoading,
    isError,
    refetch, // Add refetch here
  } = useGetOrdersQuery(searchTerm);

  const [createOrder] = useCreateOrderMutation();

  const handleCreateOrder = async (orderData: any) => {
    await createOrder(orderData);
    refetch(); // Refetch orders after creating a new one
  };

  // UseEffect to handle the periodic refetching of orders
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch(); // Regularly trigger refetch every 3 seconds
    }, 4000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [refetch]);

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !orders) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch orders
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Orders" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create Order
        </button>
      </div>

      {/* BODY ORDER LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-between">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="border shadow-lg rounded-lg p-6 max-w-full w-full mx-auto hover:shadow-xl transition duration-300 ease-in-out"
          >
            <div className="flex flex-col space-y-4">
              <h3 className="text-2xl text-gray-900 font-semibold">
                {order.name}
              </h3>
              
              <div className="text-sm text-gray-600">
                <p className="mt-1">Items: {order.items}</p>
                <p className="mt-1">Status: {order.status}</p>
              </div>
              
              <div className="text-lg font-semibold text-gray-900 mt-4">
                Total: ${parseFloat(order.totalAmount.toString()).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <CreateOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateOrder}
      />
    </div>
  );
};

export default Orders;
