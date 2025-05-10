"use client";

import { useState, useEffect, useMemo } from "react";
import { useGetExpensesByCategoryQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import {
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";
import { 
  Calendar, 
  Filter, 
  PlusCircle, 
  Download, 
  TrendingUp, 
  AlertCircle, 
  DollarSign, 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon, 
  ChevronDown,
  LineChart as LineChartIcon,
  Receipt,
  CreditCard,
  Wallet,
  Building,
  Users,
  ShoppingCart,
  Truck,
  FileText,
  Settings,
  RefreshCw,
  Scale
} from "lucide-react";

// Mock data for financial statements
const mockBalanceSheet = {
  assets: {
    current: [
      { name: 'Cash', amount: 50000 },
      { name: 'Accounts Receivable', amount: 35000 },
      { name: 'Inventory', amount: 25000 },
      { name: 'Prepaid Expenses', amount: 5000 }
    ],
    fixed: [
      { name: 'Equipment', amount: 75000 },
      { name: 'Buildings', amount: 150000 },
      { name: 'Vehicles', amount: 25000 }
    ]
  },
  liabilities: {
    current: [
      { name: 'Accounts Payable', amount: 20000 },
      { name: 'Short-term Loans', amount: 15000 },
      { name: 'Accrued Expenses', amount: 8000 }
    ],
    longTerm: [
      { name: 'Long-term Loans', amount: 100000 },
      { name: 'Bonds Payable', amount: 50000 }
    ]
  },
  equity: [
    { name: 'Common Stock', amount: 100000 },
    { name: 'Retained Earnings', amount: 45000 }
  ]
};

const mockProfitLoss = {
  revenue: [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 52000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Apr', amount: 51000 },
    { month: 'May', amount: 55000 },
    { month: 'Jun', amount: 58000 }
  ],
  expenses: [
    { month: 'Jan', amount: 32000 },
    { month: 'Feb', amount: 35000 },
    { month: 'Mar', amount: 33000 },
    { month: 'Apr', amount: 36000 },
    { month: 'May', amount: 38000 },
    { month: 'Jun', amount: 40000 }
  ]
};

const mockExpenses = [
  { id: 1, category: 'Rent', amount: 5000, date: '2023-04-01', status: 'paid' },
  { id: 2, category: 'Utilities', amount: 1200, date: '2023-04-05', status: 'paid' },
  { id: 3, category: 'Salaries', amount: 15000, date: '2023-04-10', status: 'paid' },
  { id: 4, category: 'Marketing', amount: 3000, date: '2023-04-15', status: 'pending' },
  { id: 5, category: 'Office Supplies', amount: 800, date: '2023-04-20', status: 'paid' },
  { id: 6, category: 'Insurance', amount: 2000, date: '2023-04-25', status: 'pending' },
  { id: 7, category: 'Maintenance', amount: 1500, date: '2023-04-28', status: 'paid' },
  { id: 8, category: 'Software', amount: 1200, date: '2023-04-30', status: 'pending' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AccountingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [showFilters, setShowFilters] = useState(false);
  const { data: expensesByCategory = [], isError, isLoading } = useGetExpensesByCategoryQuery();

  // Transform expenses data for the pie chart
  const pieChartData = useMemo(() => {
    if (!expensesByCategory) return [];
    
    // Group expenses by category and sum their amounts
    const groupedExpenses = expensesByCategory.reduce((acc, expense) => {
      const amount = parseFloat(expense.amount);
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format for the pie chart
    return Object.entries(groupedExpenses).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
  }, [expensesByCategory]);

  // Calculate financial metrics
  const totalAssets = useMemo(() => {
    const currentAssets = mockBalanceSheet.assets.current.reduce((sum, asset) => sum + asset.amount, 0);
    const fixedAssets = mockBalanceSheet.assets.fixed.reduce((sum, asset) => sum + asset.amount, 0);
    return currentAssets + fixedAssets;
  }, []);

  const totalLiabilities = useMemo(() => {
    const currentLiabilities = mockBalanceSheet.liabilities.current.reduce((sum, liability) => sum + liability.amount, 0);
    const longTermLiabilities = mockBalanceSheet.liabilities.longTerm.reduce((sum, liability) => sum + liability.amount, 0);
    return currentLiabilities + longTermLiabilities;
  }, []);

  const totalEquity = useMemo(() => {
    return mockBalanceSheet.equity.reduce((sum, item) => sum + item.amount, 0);
  }, []);

  const totalRevenue = useMemo(() => {
    return mockProfitLoss.revenue.reduce((sum, item) => sum + item.amount, 0);
  }, []);

  const totalExpenses = useMemo(() => {
    return mockProfitLoss.expenses.reduce((sum, item) => sum + item.amount, 0);
  }, []);

  const netIncome = totalRevenue - totalExpenses;

  const currentRatio = useMemo(() => {
    const currentAssets = mockBalanceSheet.assets.current.reduce((sum, asset) => sum + asset.amount, 0);
    const currentLiabilities = mockBalanceSheet.liabilities.current.reduce((sum, liability) => sum + liability.amount, 0);
    return currentLiabilities > 0 ? (currentAssets / currentLiabilities).toFixed(2) : 'N/A';
  }, []);

  const debtToEquityRatio = useMemo(() => {
    return totalEquity > 0 ? (totalLiabilities / totalEquity).toFixed(2) : 'N/A';
  }, [totalLiabilities, totalEquity]);

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-4">Failed to fetch financial data</div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6">
        <div>
          <Header name="Financial Dashboard" />
          <p className="text-sm text-gray-500 mt-1">
            Comprehensive view of your financial performance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 w-full sm:w-auto"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> New Transaction
          </button>
          <button
            className="flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors duration-200 border border-gray-200 w-full sm:w-auto"
          >
            <Download className="w-5 h-5 mr-2" /> Export Reports
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-xl sm:text-2xl font-bold text-green-600 mt-1">${totalRevenue.toLocaleString()}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Last 6 months
              </p>
            </div>
            <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Income</p>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">${netIncome.toLocaleString()}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {((netIncome / totalRevenue) * 100).toFixed(1)}% margin
              </p>
            </div>
            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Ratio</p>
              <h3 className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">{currentRatio}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Assets to Liabilities
              </p>
            </div>
            <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Debt to Equity</p>
              <h3 className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">{debtToEquityRatio}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Financial Leverage
              </p>
            </div>
            <div className="bg-amber-100 p-2 sm:p-3 rounded-lg">
              <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 overflow-x-auto">
        <div className="flex gap-2 sm:gap-4 min-w-max">
          <button
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap ${
              activeTab === 'balance-sheet' 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('balance-sheet')}
          >
            Balance Sheet
          </button>
          <button
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap ${
              activeTab === 'profit-loss' 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('profit-loss')}
          >
            Profit & Loss
          </button>
          <button
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap ${
              activeTab === 'expenses' 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('expenses')}
          >
            Expenses
          </button>
          <button
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap ${
              activeTab === 'cash-flow' 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('cash-flow')}
          >
            Cash Flow
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content Area */}
        <div className={`${activeTab === 'overview' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Revenue vs Expenses Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-base sm:text-lg font-semibold mb-4">Revenue vs Expenses</h3>
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockProfitLoss.revenue.map((item, index) => ({
                      month: item.month,
                      revenue: item.amount,
                      expenses: mockProfitLoss.expenses[index].amount
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue" />
                      <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="Expenses" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Financial Ratios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">Key Financial Ratios</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-600">Current Ratio</span>
                      <span className="font-semibold">{currentRatio}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-600">Debt to Equity</span>
                      <span className="font-semibold">{debtToEquityRatio}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-600">Profit Margin</span>
                      <span className="font-semibold">{((netIncome / totalRevenue) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-600">Asset Turnover</span>
                      <span className="font-semibold">{(totalRevenue / totalAssets).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">Recent Transactions</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {mockExpenses.slice(0, 5).map((expense) => (
                      <div key={expense.id} className="flex justify-between items-center">
                        <div>
                          <span className="text-sm sm:text-base font-medium">{expense.category}</span>
                          <p className="text-xs sm:text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm sm:text-base font-semibold">${expense.amount.toLocaleString()}</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            expense.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {expense.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'balance-sheet' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-lg font-semibold mb-4">Balance Sheet</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Assets */}
                  <div>
                    <h4 className="text-md font-semibold mb-3">Assets</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-2">Current Assets</h5>
                        <div className="space-y-2">
                          {mockBalanceSheet.assets.current.map((asset) => (
                            <div key={asset.name} className="flex justify-between items-center">
                              <span className="text-gray-600">{asset.name}</span>
                              <span className="font-medium">${asset.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-2">Fixed Assets</h5>
                        <div className="space-y-2">
                          {mockBalanceSheet.assets.fixed.map((asset) => (
                            <div key={asset.name} className="flex justify-between items-center">
                              <span className="text-gray-600">{asset.name}</span>
                              <span className="font-medium">${asset.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Liabilities & Equity */}
                  <div>
                    <h4 className="text-md font-semibold mb-3">Liabilities & Equity</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-2">Current Liabilities</h5>
                        <div className="space-y-2">
                          {mockBalanceSheet.liabilities.current.map((liability) => (
                            <div key={liability.name} className="flex justify-between items-center">
                              <span className="text-gray-600">{liability.name}</span>
                              <span className="font-medium">${liability.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-2">Long-term Liabilities</h5>
                        <div className="space-y-2">
                          {mockBalanceSheet.liabilities.longTerm.map((liability) => (
                            <div key={liability.name} className="flex justify-between items-center">
                              <span className="text-gray-600">{liability.name}</span>
                              <span className="font-medium">${liability.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-2">Equity</h5>
                        <div className="space-y-2">
                          {mockBalanceSheet.equity.map((item) => (
                            <div key={item.name} className="flex justify-between items-center">
                              <span className="text-gray-600">{item.name}</span>
                              <span className="font-medium">${item.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profit-loss' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-lg font-semibold mb-4">Profit & Loss Statement</h3>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockProfitLoss.revenue.map((item, index) => ({
                      month: item.month,
                      revenue: item.amount,
                      expenses: mockProfitLoss.expenses[index].amount,
                      profit: item.amount - mockProfitLoss.expenses[index].amount
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                      <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                      <Bar dataKey="profit" fill="#3B82F6" name="Profit" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h4>
                    <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Total Expenses</h4>
                    <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Net Income</h4>
                    <p className="text-2xl font-bold text-blue-600">${netIncome.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Expenses by Category</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setDateRange('month')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        dateRange === 'month' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      Month
                    </button>
                    <button
                      onClick={() => setDateRange('year')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        dateRange === 'year' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      Year
                    </button>
                  </div>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
                <div className="space-y-4">
                  {expensesByCategory.map((expense) => (
                    <div key={expense.expenseByCategorySummaryId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{expense.category}</span>
                        <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">${parseFloat(expense.amount).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cash-flow' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-lg font-semibold mb-4">Cash Flow Statement</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Operating Cash Flow</h4>
                    <p className="text-2xl font-bold text-green-600">${(netIncome * 0.8).toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Investing Cash Flow</h4>
                    <p className="text-2xl font-bold text-blue-600">-${(totalAssets * 0.1).toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Financing Cash Flow</h4>
                    <p className="text-2xl font-bold text-purple-600">-${(totalLiabilities * 0.05).toLocaleString()}</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockProfitLoss.revenue.map((item, index) => ({
                      month: item.month,
                      operating: item.amount * 0.8,
                      investing: -item.amount * 0.2,
                      financing: -item.amount * 0.1
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="operating" stroke="#10B981" name="Operating" />
                      <Line type="monotone" dataKey="investing" stroke="#3B82F6" name="Investing" />
                      <Line type="monotone" dataKey="financing" stroke="#8B5CF6" name="Financing" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {activeTab === 'overview' && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <div className="flex items-center">
                    <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-3" />
                    <span className="text-sm sm:text-base">Record Income</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-3" />
                    <span className="text-sm sm:text-base">Record Expense</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <div className="flex items-center">
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-3" />
                    <span className="text-sm sm:text-base">Bank Reconciliation</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-3" />
                    <span className="text-sm sm:text-base">Generate Reports</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mr-3" />
                    <span className="text-sm sm:text-base">Accounting Settings</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountingDashboard;
