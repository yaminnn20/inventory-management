"use client";

import React, { useState } from "react";
import {
  Settings,
  FileText,
  ShoppingCart,
  Package,
  Warehouse,
  Users,
  Truck,
  Bell,
  CreditCard,
  Shield,
  Globe,
  Mail,
  Database,
  Zap,
  Lock,
  Palette,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode } from "@/state";

interface SettingSection {
  title: string;
  icon: React.ReactNode;
  settings: {
    name: string;
    description: string;
    type: "toggle" | "select" | "input";
    value: boolean | string;
    options?: string[];
  }[];
}

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [activeTab, setActiveTab] = useState("general");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const settingSections: Record<string, SettingSection> = {
    general: {
      title: "General",
      icon: <Settings size={20} className="text-gray-600" />,
      settings: [
        {
          name: "Company Name",
          description: "Your business name as it appears throughout the system",
          type: "input",
          value: "John's Store",
        },
        {
          name: "Default Currency",
          description: "Primary currency for all transactions",
          type: "select",
          value: "USD",
          options: ["USD", "EUR", "GBP", "JPY", "INR"],
        },
        {
          name: "Time Zone",
          description: "System time zone for all date and time displays",
          type: "select",
          value: "UTC",
          options: ["UTC", "EST", "PST", "GMT", "IST"],
        },
        {
          name: "Enable Dark Mode",
          description: "Switch between light and dark theme",
          type: "toggle",
          value: isDarkMode,
        },
      ],
    },
    invoices: {
      title: "Invoice",
      icon: <FileText size={20} className="text-blue-600" />,
      settings: [
        {
          name: "Invoice Prefix",
          description: "Prefix for all invoice numbers",
          type: "input",
          value: "INV-",
        },
        {
          name: "Default Payment Terms",
          description: "Standard payment terms for new invoices",
          type: "select",
          value: "Net 30",
          options: ["Net 15", "Net 30", "Net 45", "Net 60", "Due on Receipt"],
        },
        {
          name: "Auto-generate Invoice Numbers",
          description: "Automatically generate sequential invoice numbers",
          type: "toggle",
          value: true,
        },
        {
          name: "Include Tax in Prices",
          description: "Show prices with tax included",
          type: "toggle",
          value: false,
        },
      ],
    },
    orders: {
      title: "Order",
      icon: <ShoppingCart size={20} className="text-green-600" />,
      settings: [
        {
          name: "Order Prefix",
          description: "Prefix for all order numbers",
          type: "input",
          value: "ORD-",
        },
        {
          name: "Default Order Status",
          description: "Initial status for new orders",
          type: "select",
          value: "Pending",
          options: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        },
        {
          name: "Auto-approve Orders",
          description: "Automatically approve orders below a certain amount",
          type: "toggle",
          value: false,
        },
        {
          name: "Order Approval Threshold",
          description: "Maximum amount for auto-approval",
          type: "input",
          value: "1000",
        },
      ],
    },
    products: {
      title: "Product",
      icon: <Package size={20} className="text-purple-600" />,
      settings: [
        {
          name: "Product Code Format",
          description: "Format for product SKUs",
          type: "select",
          value: "Category-Number",
          options: ["Category-Number", "Brand-Number", "Sequential", "Custom"],
        },
        {
          name: "Enable Barcode Generation",
          description: "Generate barcodes for products",
          type: "toggle",
          value: true,
        },
        {
          name: "Default Unit of Measure",
          description: "Standard unit for product quantities",
          type: "select",
          value: "Pieces",
          options: ["Pieces", "Kilograms", "Liters", "Meters", "Boxes"],
        },
        {
          name: "Low Stock Alert",
          description: "Enable notifications for low stock",
          type: "toggle",
          value: true,
        },
      ],
    },
    inventory: {
      title: "Inventory",
      icon: <Warehouse size={20} className="text-orange-600" />,
      settings: [
        {
          name: "Enable Batch Tracking",
          description: "Track products by batch numbers",
          type: "toggle",
          value: true,
        },
        {
          name: "Enable Serial Number Tracking",
          description: "Track products by serial numbers",
          type: "toggle",
          value: false,
        },
        {
          name: "Default Warehouse",
          description: "Primary warehouse for new products",
          type: "select",
          value: "Main Warehouse",
          options: ["Main Warehouse", "East Warehouse", "West Warehouse"],
        },
        {
          name: "Auto-adjust Inventory",
          description: "Automatically adjust inventory levels",
          type: "toggle",
          value: true,
        },
      ],
    },
    suppliers: {
      title: "Supplier",
      icon: <Truck size={20} className="text-red-600" />,
      settings: [
        {
          name: "Supplier Code Format",
          description: "Format for supplier codes",
          type: "select",
          value: "SUP-Number",
          options: ["SUP-Number", "Country-Number", "Sequential"],
        },
        {
          name: "Default Payment Method",
          description: "Standard payment method for suppliers",
          type: "select",
          value: "Bank Transfer",
          options: ["Bank Transfer", "Credit Card", "Check", "Cash"],
        },
        {
          name: "Enable Supplier Portal",
          description: "Allow suppliers to access their portal",
          type: "toggle",
          value: true,
        },
        {
          name: "Auto-approve Supplier Invoices",
          description: "Automatically approve supplier invoices",
          type: "toggle",
          value: false,
        },
      ],
    },
    users: {
      title: "User",
      icon: <Users size={20} className="text-indigo-600" />,
      settings: [
        {
          name: "Enable Two-Factor Authentication",
          description: "Require 2FA for all users",
          type: "toggle",
          value: true,
        },
        {
          name: "Password Policy",
          description: "Password requirements for users",
          type: "select",
          value: "Strong",
          options: ["Basic", "Medium", "Strong", "Custom"],
        },
        {
          name: "Session Timeout",
          description: "Inactive session timeout duration",
          type: "select",
          value: "30 minutes",
          options: ["15 minutes", "30 minutes", "1 hour", "2 hours"],
        },
        {
          name: "Enable User Activity Logging",
          description: "Log all user activities",
          type: "toggle",
          value: true,
        },
      ],
    },
    notifications: {
      title: "Notification",
      icon: <Bell size={20} className="text-yellow-600" />,
      settings: [
        {
          name: "Email Notifications",
          description: "Send notifications via email",
          type: "toggle",
          value: true,
        },
        {
          name: "Push Notifications",
          description: "Send push notifications",
          type: "toggle",
          value: true,
        },
        {
          name: "Low Stock Alerts",
          description: "Receive alerts for low stock",
          type: "toggle",
          value: true,
        },
        {
          name: "Order Status Updates",
          description: "Notify on order status changes",
          type: "toggle",
          value: true,
        },
      ],
    },
    integrations: {
      title: "Integration",
      icon: <Zap size={20} className="text-amber-600" />,
      settings: [
        {
          name: "Enable API Access",
          description: "Allow external systems to access the API",
          type: "toggle",
          value: true,
        },
        {
          name: "API Key Rotation",
          description: "Frequency of API key rotation",
          type: "select",
          value: "Monthly",
          options: ["Weekly", "Monthly", "Quarterly", "Never"],
        },
        {
          name: "Enable Webhooks",
          description: "Send webhook notifications",
          type: "toggle",
          value: false,
        },
        {
          name: "Integration Logging",
          description: "Log all integration activities",
          type: "toggle",
          value: true,
        },
      ],
    },
    customers: {
      title: "Customer",
      icon: <Users size={20} className="text-pink-600" />,
      settings: [
        {
          name: "Customer Code Format",
          description: "Format for customer identification codes",
          type: "select",
          value: "CUST-Number",
          options: ["CUST-Number", "Country-Number", "Sequential", "Custom"],
        },
        {
          name: "Enable Customer Portal",
          description: "Allow customers to access their portal",
          type: "toggle",
          value: true,
        },
        {
          name: "Default Credit Limit",
          description: "Standard credit limit for new customers",
          type: "input",
          value: "5000",
        },
        {
          name: "Auto-approve Customer Accounts",
          description: "Automatically approve new customer registrations",
          type: "toggle",
          value: false,
        },
        {
          name: "Customer Group Assignment",
          description: "Default group for new customers",
          type: "select",
          value: "Regular",
          options: ["Regular", "Premium", "Wholesale", "VIP"],
        },
        {
          name: "Enable Customer Reviews",
          description: "Allow customers to leave product reviews",
          type: "toggle",
          value: true,
        },
        {
          name: "Review Moderation",
          description: "Require approval for customer reviews",
          type: "toggle",
          value: true,
        },
        {
          name: "Customer Communication",
          description: "Default communication method",
          type: "select",
          value: "Email",
          options: ["Email", "SMS", "Both", "None"],
        },
        {
          name: "Enable Customer Loyalty Program",
          description: "Activate points and rewards system",
          type: "toggle",
          value: true,
        },
        {
          name: "Points Expiration",
          description: "Duration before loyalty points expire",
          type: "select",
          value: "1 Year",
          options: ["3 Months", "6 Months", "1 Year", "Never"],
        },
        {
          name: "Customer Data Retention",
          description: "How long to keep inactive customer data",
          type: "select",
          value: "5 Years",
          options: ["1 Year", "3 Years", "5 Years", "10 Years", "Indefinitely"],
        },
        {
          name: "Enable Customer Segmentation",
          description: "Allow customer grouping by behavior",
          type: "toggle",
          value: true,
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <Settings size={24} />
            <span>Settings Menu</span>
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-64 bg-white shadow-md md:shadow-none`}
        >
          <div className="p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 hidden md:block">
              Settings
            </h2>
            <div className="space-y-2">
        {Object.entries(settingSections).map(([key, section]) => (
          <button
            key={key}
                  onClick={() => {
                    setActiveTab(key);
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === key
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {section.icon}
                  <span className="text-sm font-medium">{section.title}</span>
          </button>
        ))}
            </div>
          </div>
      </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              {settingSections[activeTab].title} Settings
            </h1>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 md:p-6 space-y-6">
          {settingSections[activeTab].settings.map((setting, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                        <h3 className="text-base md:text-lg font-medium text-gray-800">
                          {setting.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {setting.description}
                        </p>
              </div>
                      <div className="w-full md:w-auto">
                {setting.type === "toggle" && (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={setting.name === "Enable Dark Mode" ? isDarkMode : setting.value as boolean}
                              onChange={() => {
                                if (setting.name === "Enable Dark Mode") {
                                  dispatch(setIsDarkMode(!isDarkMode));
                                }
                              }}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                )}
                {setting.type === "select" && (
                          <select
                            className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={setting.value as string}
                            onChange={() => {}}
                          >
                    {setting.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {setting.type === "input" && (
                    <input
                      type="text"
                            className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={setting.value as string}
                            onChange={() => {}}
                  />
                )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
