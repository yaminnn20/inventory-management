import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useGetUsersQuery, useGetOrdersQuery } from '@/state/api';

interface InvoiceFormData {
  customerName: string;
  totalAmount: number;
  date: string;
  items: string;
  selectedOrderId?: string;
}

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: InvoiceFormData) => void;
}

const CreateInvoiceModal = ({ isOpen, onClose, onCreate }: CreateInvoiceModalProps) => {
  const { data: users = [] } = useGetUsersQuery();
  const { data: orders = [] } = useGetOrdersQuery();
  
  const [formData, setFormData] = useState<InvoiceFormData>({
    customerName: '',
    totalAmount: 0,
    date: new Date().toISOString().split('T')[0],
    items: '',
    selectedOrderId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'selectedOrderId') {
      const selectedOrder = orders.find(order => order.orderId === value);
      if (selectedOrder) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          customerName: selectedOrder.name,
          totalAmount: selectedOrder.totalAmount,
          items: selectedOrder.items,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'totalAmount' ? parseFloat(value) || 0 : value,
      }));
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded-xl bg-white p-6 w-full">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Create New Invoice
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="selectedOrderId" className="block text-sm font-medium text-gray-700">
                Select Order (Optional)
              </label>
              <select
                id="selectedOrderId"
                name="selectedOrderId"
                value={formData.selectedOrderId}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select an order...</option>
                {orders.map((order) => (
                  <option key={order.orderId} value={order.orderId}>
                    {order.name} - ${order.totalAmount}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <select
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select a customer...</option>
                {users.map((user) => (
                  <option key={user.userId} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
                Total Amount
              </label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="items" className="block text-sm font-medium text-gray-700">
                Items (comma-separated)
              </label>
              <textarea
                id="items"
                name="items"
                value={formData.items}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Item 1, Item 2, Item 3"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter items separated by commas. Add 'paid' or 'pending' to indicate status.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Invoice
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateInvoiceModal;