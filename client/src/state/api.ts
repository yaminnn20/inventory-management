import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Product Interfaces
export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

// Invoice Interfaces
export interface Invoice {
  invoiceId: string;
  customerName: string;
  date: string;
  totalAmount: number;
  items: string;
}

export interface NewInvoice {
  customerName: string;
  date: string;
  totalAmount: number;
  items: string;
}

// Order Interfaces
export interface Order {
  orderId: string;
  name: string;
  totalAmount: number;
  items: string;
  status: string;
}

export interface NewOrder {
  name: string;
  totalAmount: number;
  items: string;
  status: string;
}

// Dashboard Metrics Interfaces
export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummaryId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

// User Interface
export interface User {
  userId: string;
  name: string;
  email: string;
}

// Supplier Interfaces
export interface Supplier {
  supplierId: string;
  name: string;
  totalPayment: number;
  paymentDue: number;
  phone?: string;
  email?: string;
  address?: string;
}

export interface NewSupplier {
  name: string;
  totalPayment: number;
  paymentDue: number;
  phone?: string;
  email?: string;
  address?: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Users", "Expenses", "Suppliers", "Invoices", "Orders"],
  endpoints: (build) => ({
    // Dashboard
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),

    // Products
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    // Users
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // Expenses
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),

    // Suppliers
    getSuppliers: build.query<Supplier[], void>({
      query: () => "/suppliers",
      providesTags: ["Suppliers"],
    }),
    createSupplier: build.mutation<Supplier, NewSupplier>({
      query: (newSupplier) => ({
        url: "/suppliers",
        method: "POST",
        body: newSupplier,
      }),
      invalidatesTags: ["Suppliers"],
    }),

    // Invoices
    getInvoices: build.query<Invoice[], string | void>({
      query: (search) => ({
        url: "/invoices",
        params: search ? { search } : {},
      }),
      providesTags: ["Invoices"],
    }),
    createInvoice: build.mutation<Invoice, NewInvoice>({
      query: (newInvoice) => ({
        url: "/invoices",
        method: "POST",
        body: newInvoice,
      }),
      invalidatesTags: ["Invoices"],
    }),

    // Orders
    getOrders: build.query<Order[], string | void>({
      query: (search) => ({
        url: "/orders",
        params: search ? { search } : {},
      }),
      providesTags: ["Orders"],
    }),
    createOrder: build.mutation<Order, NewOrder>({
      query: (newOrder) => ({
        url: "/orders",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetUsersQuery,
  useGetExpensesByCategoryQuery,
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useGetOrdersQuery,
  useCreateOrderMutation,
} = api;
