"use client";

import {
  CheckCircle,
  Package,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import CardExpenseSummary from "./CardExpenseSummary";
import CardPopularProducts from "./CardPopularProducts";
import CardPurchaseSummary from "./CardPurchaseSummary";
import CardSalesSummary from "./CardSalesSummary";
import StatCard from "./StatCard";

const Dashboard = () => {
  return (
    <div className="relative min-h-screen rounded-2xl bg-gray-100 p-4">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-blue-100">Here's what's happening with your business today.</p>
        </div>
        
        {/* Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CardSalesSummary />
          </div>
          <div className="lg:col-span-1">
            <CardPopularProducts />
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Sales & Discount"
            primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
            dateRange="22 - 29 January 2025"
            details={[
              {
                title: "Sales",
                amount: "1000.00",
                changePercentage: 20,
                IconComponent: TrendingUp,
              },
              {
                title: "Discount",
                amount: "200.00",
                changePercentage: -10,
                IconComponent: TrendingDown,
              },
            ]}
          />
          <StatCard
            title="Customer & Expense"
            primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
            dateRange="22 - 29 January 2025"
            details={[
              {
                title: "Customer Growth",
                amount: "175.00",
                changePercentage: 131,
                IconComponent: TrendingUp,
              },
              {
                title: "Expenses",
                amount: "10.00",
                changePercentage: -56,
                IconComponent: TrendingDown,
              },
            ]}
          />
          <StatCard
            title="Dues & Orders"
            primaryIcon={<CheckCircle className="text-blue-600 w-6 h-6" />}
            dateRange="22 - 29 January 2025"
            details={[
              {
                title: "Dues",
                amount: "250.00",
                changePercentage: 131,
                IconComponent: TrendingUp,
              },
              {
                title: "Pending Orders",
                amount: "147",
                changePercentage: -56,
                IconComponent: TrendingDown,
              },
            ]}
          />
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <CardPurchaseSummary />
          </div>
          <div>
            <CardExpenseSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
