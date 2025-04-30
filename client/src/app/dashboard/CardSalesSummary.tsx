import { useGetDashboardMetricsQuery } from "@/state/api";
import { TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CardSalesSummary = () => {
  const { data, isLoading, isError } = useGetDashboardMetricsQuery();
  const salesData = data?.salesSummary || [];
  const [timeframe, setTimeframe] = useState("weekly");

  const totalValueSum =
    salesData.reduce((acc, curr) => acc + curr.totalValue, 0) || 0;

  const averageChangePercentage =
    salesData.reduce((acc, curr, _, array) => {
      return acc + curr.changePercentage! / array.length;
    }, 0) || 0;

  const highestValueData = salesData.reduce((acc, curr) => {
    return acc.totalValue > curr.totalValue ? acc : curr;
  }, salesData[0] || {});

  const highestValueDate = highestValueData.date
    ? new Date(highestValueData.date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  if (isError) {
    return <div className="p-5 text-sm text-red-500">Failed to fetch data</div>;
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300">
      {isLoading ? (
        <div className="p-6 text-gray-500 text-sm">Loading sales summary...</div>
      ) : (
        <>
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Sales Summary
            </h2>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Stats Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-400 mb-1">Total Sales</p>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-800">
                    ${(totalValueSum / 1_000_000).toFixed(2)}<span className="text-lg ml-1">m</span>
                  </span>
                  <span className="ml-3 text-green-600 text-sm flex items-center bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {averageChangePercentage.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div>
                <select
                  className="border border-gray-200 bg-white rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${(value / 1_000_000).toFixed(0)}m`}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`]}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    }
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                    }}
                    labelStyle={{ color: "#111827", fontWeight: 500 }}
                    itemStyle={{ color: "#2563eb" }}
                  />
                  <Bar
                    dataKey="totalValue"
                    fill="url(#colorSales)"
                    radius={[6, 6, 0, 0]}
                    barSize={24}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-100 px-5 py-4 text-sm flex flex-col md:flex-row justify-between gap-2 text-gray-600">
            <span>{salesData.length || 0} days of data</span>
            <span>
              Peak sales:{" "}
              <span className="font-semibold text-gray-800">
                {highestValueDate}
              </span>
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default CardSalesSummary;
