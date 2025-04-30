import { useGetDashboardMetricsQuery } from "@/state/api";
import { ShoppingBag } from "lucide-react";
import React from "react";
import Rating from "../(components)/Rating";
import Image from "next/image";

const CardPopularProducts = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  const topProducts = dashboardMetrics?.popularProducts.slice(0, 5) || [];

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden transition-shadow duration-300">
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Popular Products</h3>
      </div>

      {isLoading ? (
        <div className="p-5 text-gray-500 text-sm">Loading top products...</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {topProducts.map((product) => (
            <div
              key={product.productId}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={`https://r1-inventorymanagement.s3.us-east-1.amazonaws.com/product${
                      Math.floor(Math.random() * 3) + 1
                    }.png`}
                    alt={product.name}
                    width={56}
                    height={56}
                    className="rounded-lg object-cover w-14 h-14 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    {Math.round(product.stockQuantity / 10000)}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm">
                    {product.name}
                  </span>
                  <div className="flex items-center text-xs text-gray-500 gap-2">
                    <span className="text-blue-500 font-semibold">
                      ${product.price}
                    </span>
                    <span>·</span>
                    <Rating rating={product.rating || 0} />
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col items-center text-xs text-gray-400">
                <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                  <ShoppingBag className="w-4 h-4" />
                </button>
                <span className="mt-1">Sold</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardPopularProducts;
