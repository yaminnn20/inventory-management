import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useGetUsersQuery, useGetProductsQuery } from '@/state/api';

interface ProductSelection {
  productId: string;
  quantity: number;
}

interface OrderFormData {
  name: string;
  totalAmount: number;
  items: string;
  status: string;
  selectedProducts: ProductSelection[];
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: OrderFormData) => void;
}

const CreateOrderModal = ({ isOpen, onClose, onCreate }: CreateOrderModalProps) => {
  const { data: users = [] } = useGetUsersQuery();
  const { data: products = [] } = useGetProductsQuery();
  
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    totalAmount: 0,
    items: '',
    status: 'pending',
    selectedProducts: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalAmount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleProductSelect = (productId: string) => {
    setFormData(prev => {
      const existingProduct = prev.selectedProducts.find(p => p.productId === productId);
      let newSelectedProducts: ProductSelection[];

      if (existingProduct) {
        // Remove the product if it exists
        newSelectedProducts = prev.selectedProducts.filter(p => p.productId !== productId);
      } else {
        // Add the product with quantity 1
        newSelectedProducts = [...prev.selectedProducts, { productId, quantity: 1 }];
      }

      return updateOrderDetails(prev, newSelectedProducts);
    });
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setFormData(prev => {
      const newSelectedProducts = prev.selectedProducts.map(p => 
        p.productId === productId ? { ...p, quantity: Math.max(1, quantity) } : p
      );

      return updateOrderDetails(prev, newSelectedProducts);
    });
  };

  const updateOrderDetails = (prev: OrderFormData, selectedProducts: ProductSelection[]) => {
    const selectedProductsWithDetails = selectedProducts.map(sp => {
      const product = products.find(p => p.productId === sp.productId);
      return { ...sp, product };
    });

    const totalAmount = selectedProductsWithDetails.reduce((sum, { product, quantity }) => 
      sum + (product?.price || 0) * quantity, 0
    );

    const items = selectedProductsWithDetails
      .map(({ product, quantity }) => `${product?.name} (x${quantity})`)
      .join(', ');

    return {
      ...prev,
      selectedProducts,
      totalAmount,
      items
    };
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded-xl bg-white p-6 w-full">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Create New Order
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <select
                id="name"
                name="name"
                value={formData.name}
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
              <label className="block text-sm font-medium text-gray-700">
                Select Products
              </label>
              <div className="mt-2 max-h-60 overflow-y-auto border rounded-md p-2">
                {products.map((product) => {
                  const selectedProduct = formData.selectedProducts.find(p => p.productId === product.productId);
                  const isSelected = !!selectedProduct;

                  return (
                    <div key={product.productId} className="flex items-center space-x-4 p-2 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={`product-${product.productId}`}
                        checked={isSelected}
                        onChange={() => handleProductSelect(product.productId)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`product-${product.productId}`} className="flex-1">
                        {product.name} - ${product.price}
                      </label>
                      {isSelected && (
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product.productId, (selectedProduct?.quantity || 1) - 1)}
                            className="px-2 py-1 border rounded-md hover:bg-gray-100"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={selectedProduct?.quantity || 1}
                            onChange={(e) => handleQuantityChange(product.productId, parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-16 text-center border rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product.productId, (selectedProduct?.quantity || 1) + 1)}
                            className="px-2 py-1 border rounded-md hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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
              <label htmlFor="items" className="block text-sm font-medium text-gray-700">
                Selected Items
              </label>
              <textarea
                id="items"
                name="items"
                value={formData.items}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Selected items will appear here"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
              </select>
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
                Create Order
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateOrderModal;