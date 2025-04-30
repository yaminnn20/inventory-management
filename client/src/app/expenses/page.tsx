"use client";

// page.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useGetExpensesByCategoryQuery } from "@/state/api";
import {
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Receipt,
  FileText,
  Download,
  Filter,
  Calendar,
  BarChart2,
  AlertCircle,
  ChevronDown,
  Search,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  status: "paid" | "pending" | "overdue";
  receipt?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ReportsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("thisMonth");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use the API hook to fetch expenses
  const { data: expensesByCategory = [], isLoading, isError } = useGetExpensesByCategoryQuery();

  // Transform the API data into the format we need
  const expenses = useMemo(() => {
    return expensesByCategory.map((expense) => ({
      id: expense.expenseByCategorySummaryId,
      date: expense.date,
      category: expense.category,
      description: `${expense.category} expense`,
      amount: parseFloat(expense.amount),
      paymentMethod: "Credit Card", // Default value since not provided by API
      status: "paid", // Default value since not provided by API
    }));
  }, [expensesByCategory]);

  // Calculate summary statistics
  const totalExpenses = useMemo(() => 
    expenses.reduce((sum, exp) => sum + exp.amount, 0), 
    [expenses]
  );
  
  const paidExpenses = useMemo(() => 
    expenses
      .filter((exp) => exp.status === "paid")
      .reduce((sum, exp) => sum + exp.amount, 0),
    [expenses]
  );
  
  const pendingExpenses = useMemo(() => 
    expenses
      .filter((exp) => exp.status === "pending")
      .reduce((sum, exp) => sum + exp.amount, 0),
    [expenses]
  );
  
  const overdueExpenses = useMemo(() => 
    expenses
      .filter((exp) => exp.status === "overdue")
      .reduce((sum, exp) => sum + exp.amount, 0),
    [expenses]
  );

  // Group expenses by category
  const expensesByCategoryMap = useMemo(() => 
    expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>),
    [expenses]
  );

  // Transform data for pie chart
  const pieChartData = useMemo(() => {
    return Object.entries(expensesByCategoryMap).map(([name, value]) => ({
      name,
      value
    }));
  }, [expensesByCategoryMap]);

  // Transform data for line chart (last 6 months)
  const lineChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const monthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.toLocaleString('default', { month: 'short' }) === month;
      });
      const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      return {
        month,
        amount: total
      };
    });
  }, [expenses]);

  const handleAddExpense = () => {
    router.push('/expenses/new');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p>Failed to fetch expenses</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Expense Management</h1>
            <p className="text-gray-600">Track, analyze, and manage your business expenses</p>
          </div>
          <button
            onClick={handleAddExpense}
            className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">Total Expenses</h3>
            <DollarSign className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</div>
          <div className="flex items-center text-green-500 mt-2">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">Paid</h3>
            <CreditCard className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${paidExpenses.toFixed(2)}</div>
          <div className="flex items-center text-green-500 mt-2">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">Pending</h3>
            <Receipt className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${pendingExpenses.toFixed(2)}</div>
          <div className="flex items-center text-red-500 mt-2">
            <TrendingDown className="w-4 h-4 mr-1" />
            <span className="text-sm">3% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">Overdue</h3>
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${overdueExpenses.toFixed(2)}</div>
          <div className="flex items-center text-red-500 mt-2">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">5% from last month</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
          <Calendar className="text-gray-400 w-4 h-4" />
          <select
            className="bg-transparent border-none focus:ring-0 text-gray-600"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="thisQuarter">This Quarter</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
          <Search className="text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="bg-transparent border-none focus:ring-0 text-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        <button className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h2>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => router.push(`/expenses/${expense.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg">
                      <Receipt className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{expense.description}</h3>
                      <p className="text-sm text-gray-500">
                        {expense.category} • {expense.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">{expense.paymentMethod}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Trends</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '10px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{
                      fill: '#3b82f6',
                      stroke: '#fff',
                      strokeWidth: 2,
                      r: 4
                    }}
                    activeDot={{
                      fill: '#fff',
                      stroke: '#3b82f6',
                      strokeWidth: 2,
                      r: 6
                    }}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;