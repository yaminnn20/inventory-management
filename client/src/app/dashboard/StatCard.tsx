import { LucideIcon } from "lucide-react";
import React from "react";

type StatDetail = {
  title: string;
  amount: string;
  changePercentage: number;
  IconComponent: LucideIcon;
};

type StatCardProps = {
  title: string;
  primaryIcon: JSX.Element;
  details: StatDetail[];
  dateRange: string;
};

const StatCard = ({
  title,
  primaryIcon,
  details,
  dateRange,
}: StatCardProps) => {
  const formatPercentage = (value: number) => {
    const signal = value >= 0 ? "+" : "";
    return `${signal}${value.toFixed()}%`;
  };

  const getChangeColor = (value: number) =>
    value >= 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* HEADER */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-800">{title}</h2>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{dateRange}</span>
        </div>
      </div>

      {/* BODY */}
      <div className="p-5">
        <div className="flex items-center gap-4 mb-6">
          <div className="rounded-full p-4 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 shadow-sm">
          {primaryIcon}
        </div>
        <div className="flex-1">
          {details.map((detail, index) => (
            <React.Fragment key={index}>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 text-sm">{detail.title}</span>
                  <div className="flex items-center gap-3">
                <span className="font-bold text-gray-800">{detail.amount}</span>
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs ${getChangeColor(detail.changePercentage) === 'text-green-500' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <detail.IconComponent
                        className={`w-3 h-3 mr-1 ${getChangeColor(
                      detail.changePercentage
                    )}`}
                  />
                  <span
                    className={`font-medium ${getChangeColor(
                      detail.changePercentage
                    )}`}
                  >
                    {formatPercentage(detail.changePercentage)}
                  </span>
                </div>
              </div>
                </div>
                {index < details.length - 1 && <div className="border-b border-gray-100 my-1"></div>}
            </React.Fragment>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
