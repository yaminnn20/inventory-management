"use client";

import { useState } from "react";
import { X, Truck, Package, MapPin, Calendar, Clock, Info } from "lucide-react";
import { useGetOrdersQuery } from "@/state/api";

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateShipment: (shipmentData: ShipmentFormData) => void;
}

interface ShipmentFormData {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  shippingMethod: string;
  estimatedDelivery: string;
  address: string;
  specialInstructions: string;
}

const carriers = [
  "FedEx",
  "UPS",
  "DHL",
  "USPS",
  "Local Delivery"
];

const shippingMethods = [
  "Standard Ground",
  "Express",
  "Next Day Air",
  "Two-Day Air",
  "International"
];

const CreateShipmentModal = ({ isOpen, onClose, onCreateShipment }: CreateShipmentModalProps) => {
  const [formData, setFormData] = useState<ShipmentFormData>({
    orderId: "",
    carrier: "",
    trackingNumber: "",
    shippingMethod: "",
    estimatedDelivery: "",
    address: "",
    specialInstructions: ""
  });

  // Fetch orders
  const { data: orders = [] } = useGetOrdersQuery("");

  // Filter orders that don't have 'delivered' status
  const availableOrders = orders.filter(order => {
    const status = order.status?.toLowerCase() || '';
    return !status.includes('delivered');
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateShipment(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If selecting an order, update the orderId and potentially the address
    if (name === "orderSelect") {
      const selectedOrder = orders.find(order => order.orderId === value);
      setFormData(prev => ({
        ...prev,
        orderId: value,
        // You might want to pre-fill the address if it's available in the order data
        // address: selectedOrder?.address || prev.address,
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Create New Shipment</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Order
              </label>
              <select
                name="orderSelect"
                value={formData.orderId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select an order</option>
                {availableOrders.map(order => (
                  <option key={order.orderId} value={order.orderId}>
                    {order.name} (${order.totalAmount.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            {/* Carrier Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carrier
              </label>
              <select
                name="carrier"
                value={formData.carrier}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select a carrier</option>
                {carriers.map(carrier => (
                  <option key={carrier} value={carrier}>{carrier}</option>
                ))}
              </select>
            </div>

            {/* Tracking Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Number
              </label>
              <input
                type="text"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            {/* Shipping Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Method
              </label>
              <select
                name="shippingMethod"
                value={formData.shippingMethod}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select shipping method</option>
                {shippingMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            {/* Estimated Delivery */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Delivery Date
              </label>
              <input
                type="date"
                name="estimatedDelivery"
                value={formData.estimatedDelivery}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipping Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Any special handling instructions..."
            />
          </div>

          {/* Shipment Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-medium text-gray-700">Shipment Summary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Package ready for pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Delivery address verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Scheduled for processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Estimated processing time: 1-2 days</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Shipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShipmentModal; 