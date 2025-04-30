import {
  ExpenseByCategorySummary,
  useGetDashboardMetricsQuery,
} from "@/state/api";
import { TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts";

type ExpenseSums = {
  [category: string]: number;
};

const COLORS = [
  { start: '#3b82f6', end: '#60a5fa' }, // Blue gradient
  { start: '#10b981', end: '#34d399' }, // Green gradient
  { start: '#6366f1', end: '#818cf8' }, // Indigo gradient
  { start: '#f59e0b', end: '#fbbf24' }, // Yellow gradient
  { start: '#ec4899', end: '#f472b6' }, // Pink gradient
  { start: '#8b5cf6', end: '#a78bfa' }, // Purple gradient
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 2.1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="gray-800"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CardExpenseSummary = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  const expenseSummary = dashboardMetrics?.expenseSummary[0];

  const expenseByCategorySummary =
    dashboardMetrics?.expenseByCategorySummary || [];

  const expenseSums = expenseByCategorySummary.reduce(
    (acc: ExpenseSums, item: ExpenseByCategorySummary) => {
      const category = item.category + " Expenses";
      const amount = parseInt(item.amount, 10);
      if (!acc[category]) acc[category] = 0;
      acc[category] += amount;
      return acc;
    },
    {}
  );

  const expenseCategories = Object.entries(expenseSums).map(
    ([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    })
  );

  const totalExpenses = expenseCategories.reduce(
    (acc, category: { value: number }) => acc + category.value,
    0
  );
  const formattedTotalExpenses = totalExpenses.toFixed(2);

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {isLoading ? (
        <div className="p-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Expense Summary
            </h2>
          </div>

          {/* BODY */}
          <div className="p-5">
            <div className="flex flex-col items-center">
              {/* Total Value Display */}
              <div className="mb-6 text-center">
                <p className="text-xs text-gray-400 mb-1">Total Expenses</p>
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">
                    ${formattedTotalExpenses}
                  </span>
                  <span className="text-green-500 text-sm ml-3 flex items-center bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="inline w-4 h-4 mr-1" />
                    0.00%
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div className="relative w-full h-[210px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {COLORS.map((color, index) => (
                        <linearGradient
                          key={`gradient-${index}`}
                          id={`gradient-${index}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor={color.start} />
                          <stop offset="100%" stopColor={color.end} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={renderCustomizedLabel}
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={1}
                      dataKey="value"
                      startAngle={0}
                      endAngle={360}
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#gradient-${index % COLORS.length})`}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      content={({ payload }) => (
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                          {payload?.map((entry: any, index: number) => (
                            <div key={`legend-${index}`} className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{
                                  background: `linear-gradient(to bottom, ${COLORS[index % COLORS.length].start}, ${COLORS[index % COLORS.length].end})`,
                                }}
                              />
                              <span className="text-xs text-gray-800">{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardExpenseSummary;
