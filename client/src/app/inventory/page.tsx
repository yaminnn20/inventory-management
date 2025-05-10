"use client";

import { useState, useEffect, useMemo } from "react";
import { useCreateProductMutation, useGetProductsQuery } from "@/state/api";
import { 
  PlusCircleIcon, 
  SearchIcon, 
  GridIcon, 
  TableIcon,
  Package,
  AlertCircle,
  Filter,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Tag,
  ChevronDown,
  Settings,
  Download
} from "lucide-react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import Image from "next/image";
import { DataGrid } from "@mui/x-data-grid";

type Product = {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
  category?: string;
};

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
  category?: string;
};

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery(searchTerm) as { 
    data: Product[]; 
    isLoading: boolean; 
    isError: boolean; 
    refetch: () => void; 
  };

  const [createProduct] = useCreateProductMutation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 4000);
    return () => clearInterval(intervalId);
  }, [refetch]);

  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
    setIsModalOpen(false);
    refetch();
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      (selectedCategory === "all" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, selectedCategory, searchTerm]);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category || "Uncategorized")));
  }, [products]);

  const columns = [
    { field: 'productId', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Product Name', width: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'price', headerName: 'Price', width: 130, renderCell: (params: any) => `$${params.value.toFixed(2)}` },
    { field: 'stockQuantity', headerName: 'Stock', width: 130 },
    { field: 'rating', headerName: 'Rating', width: 130, renderCell: (params: any) => <Rating rating={params.value || 0} /> },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: () => (
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="w-4 h-4" />
        </button>
      ),
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-lg">Failed to fetch inventory</p>
        <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Inventory Management</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your products</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <PlusCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Add Product
              </button>
              <button className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Total Products</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900 mt-1 sm:mt-2">{products.length}</p>
                </div>
                <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-green-600">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>12% increase</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Low Stock</p>
                  <p className="text-xl sm:text-2xl font-semibold text-yellow-600 mt-1 sm:mt-2">
                    {products.filter(p => p.stockQuantity < 10).length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-2 sm:p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-red-600">
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>5% increase</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Out of Stock</p>
                  <p className="text-xl sm:text-2xl font-semibold text-red-600 mt-1 sm:mt-2">
                    {products.filter(p => p.stockQuantity === 0).length}
                  </p>
                </div>
                <div className="bg-red-50 p-2 sm:p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-red-600">
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>3% increase</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Total Value</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900 mt-1 sm:mt-2">
                    ${products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-50 p-2 sm:p-3 rounded-lg">
                  <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-green-600">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>8% increase</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-2 sm:pl-3 pr-6 sm:pr-8 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
              </div>

              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                >
                  <GridIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 sm:p-2 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                >
                  <TableIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.productId}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <Image
                    src={`https://r1-inventorymanagement.s3.us-east-1.amazonaws.com/product${
                      Math.floor(Math.random() * 3) + 1
                    }.png`}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <button className="absolute top-2 right-2 p-1 sm:p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                    <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </button>
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <p className="text-base sm:text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
                    <Rating rating={product.rating || 0} />
                  </div>
                  <div className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                    product.stockQuantity === 0 ? 'bg-red-100 text-red-800' :
                    product.stockQuantity < 10 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {product.stockQuantity === 0 ? 'Out of Stock' :
                     product.stockQuantity < 10 ? 'Low Stock' :
                     'In Stock'}: {product.stockQuantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <DataGrid
                rows={filteredProducts}
                columns={columns}
                getRowId={(row) => row.productId}
                autoHeight
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[10, 25, 50]}
                className="rounded-xl"
                sx={{
                  '& .MuiDataGrid-cell': {
                    fontSize: '0.875rem',
                    '@media (min-width: 640px)': {
                      fontSize: '1rem',
                    },
                  },
                  '& .MuiDataGrid-columnHeader': {
                    fontSize: '0.875rem',
                    '@media (min-width: 640px)': {
                      fontSize: '1rem',
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        <CreateProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateProduct}
        />
      </div>
    </div>
  );
};

export default Inventory;
