import { useGetDashboardMetricsQuery } from "@/state/api";
import { TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CardPurchaseSummary = () => {
  const { data, isLoading, isError } = useGetDashboardMetricsQuery();
  const purchaseData = data?.purchaseSummary || [];

  const [timeframe, setTimeframe] = useState("weekly");

  const totalValueSum =
    purchaseData.reduce((acc: any, curr: any) => acc + curr.totalPurchased, 0) || 0;

  const averageChangePercentage =
    purchaseData.reduce((acc: any, curr: any, _: any, array: any[]) => {
      return acc + curr.changePercentage! / array.length;
    }, 0) || 0;

  const highestValueData = purchaseData.reduce((acc: any, curr: any) => {
    return acc.totalPurchased > curr.totalPurchased ? acc : curr;
  }, purchaseData[0] || {});

  const highestValueDate = highestValueData.date
    ? new Date(highestValueData.date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      })
    : "N/A";

  if (isError) {
    return <div className="p-5">Failed to fetch data</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {isLoading ? (
        <div className="p-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Purchase Summary
            </h2>
          </div>

          {/* BODY */}
          <div className="p-5">
            {/* BODY HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Total Value</p>
              <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-800">
                    $
                    {(totalValueSum / 1000000).toLocaleString("en", {
                      maximumFractionDigits: 2,
                    })}
                    <span className="text-lg ml-1">m</span>
                  </span>
                  <span className="text-green-500 text-sm ml-3 flex items-center bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="inline w-4 h-4 mr-1" />
                    {averageChangePercentage.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="shadow-sm border border-gray-200 bg-white p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={timeframe}
                  onChange={(e) => {
                    setTimeframe(e.target.value);
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            
            {/* CHART */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                data={purchaseData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPurchase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(value) => {
                      return `$${(value / 1000000).toFixed(0)}m`;
                    }}
                    tick={{ fontSize: 12, dx: -1 }}
                    tickLine={false}
                    axisLine={false}
                  />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString("en")}`,
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                />
                  <Line
                    type="monotone"
                  dataKey="totalPurchased"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ stroke: '#6366f1', strokeWidth: 2, r: 4, fill: 'white' }}
                    activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2, fill: 'white' }}
                />
                </LineChart>
            </ResponsiveContainer>
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-5 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-sm">
              <p className="text-gray-500">{purchaseData.length || 0} days of data</p>
              <p className="text-gray-600">
                Highest Purchase: <span className="font-bold text-gray-800">{highestValueDate}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardPurchaseSummary;
