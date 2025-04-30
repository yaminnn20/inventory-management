"use client";

// page.tsx
import React, { useState } from "react";
import {
  MessageSquare,
  Package,
  BarChart,
  Bot,
  Workflow,
  Bell,
  Box,
  Truck,
  FileCheck,
  Mail,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

interface AutomationFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "active" | "inactive" | "pending";
  lastRun?: string;
  nextRun?: string;
}

const AutomationPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const features: AutomationFeature[] = [
    {
      id: "auto-messaging",
      title: "Auto Messaging",
      description: "Automatically send texts on WhatsApp and emails via Gmail",
      icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
      status: "active",
      lastRun: "2 minutes ago",
      nextRun: "In 5 minutes",
    },
    {
      id: "inventory-alerts",
      title: "Inventory Management",
      description: "Get low stock alerts and instantly notify suppliers",
      icon: <Package className="w-6 h-6 text-green-500" />,
      status: "active",
      lastRun: "5 minutes ago",
      nextRun: "In 10 minutes",
    },
    {
      id: "business-insights",
      title: "Business Insights",
      description: "Track product performance with real-time data",
      icon: <BarChart className="w-6 h-6 text-purple-500" />,
      status: "active",
      lastRun: "1 hour ago",
      nextRun: "In 1 hour",
    },
    {
      id: "conversational-ai",
      title: "Conversational AI",
      description: "Chat with your own data—add, remove, and edit on the go",
      icon: <Bot className="w-6 h-6 text-pink-500" />,
      status: "active",
      lastRun: "Just now",
      nextRun: "Continuous",
    },
    {
      id: "workflow-automation",
      title: "Automated Workflows",
      description: "AI handles customer interactions via text, reducing manual effort",
      icon: <Workflow className="w-6 h-6 text-orange-500" />,
      status: "active",
      lastRun: "15 minutes ago",
      nextRun: "In 30 minutes",
    },
    {
      id: "smart-notifications",
      title: "Smart Notifications",
      description: "Auto-send campaign updates, payment reminders, and stock alerts",
      icon: <Bell className="w-6 h-6 text-yellow-500" />,
      status: "active",
      lastRun: "10 minutes ago",
      nextRun: "In 20 minutes",
    },
    {
      id: "inventory-control",
      title: "Smart Inventory Control",
      description: "Track expiring items, stock movement, and restocking needs",
      icon: <Box className="w-6 h-6 text-teal-500" />,
      status: "active",
      lastRun: "30 minutes ago",
      nextRun: "In 1 hour",
    },
    {
      id: "logistics-integration",
      title: "Logistics Automation",
      description: "Direct integration with logistics companies for order fulfillment",
      icon: <Truck className="w-6 h-6 text-indigo-500" />,
      status: "pending",
      lastRun: "Never",
      nextRun: "Pending setup",
    },
    {
      id: "ai-auditing",
      title: "AI-Powered Auditing",
      description: "Track payments, update balances, and optimize expenses",
      icon: <FileCheck className="w-6 h-6 text-red-500" />,
      status: "active",
      lastRun: "1 day ago",
      nextRun: "In 1 day",
    },
    {
      id: "supplier-communication",
      title: "Seamless Supplier Communication",
      description: "AI checks inventory and auto-requests new stock when needed",
      icon: <Mail className="w-6 h-6 text-amber-500" />,
      status: "active",
      lastRun: "2 hours ago",
      nextRun: "In 4 hours",
    },
  ];

  const getStatusIcon = (status: AutomationFeature["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "inactive":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const filteredFeatures = features.filter((feature) => {
    if (activeTab === "all") return true;
    return feature.status === activeTab;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Automation Hub</h1>
        <p className="text-gray-600">
          Save time and reduce complexity—no learning curve required. Automate processes effortlessly.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-2 px-1 ${
            activeTab === "all"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All Features
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-2 px-1 ${
            activeTab === "active"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab("inactive")}
          className={`pb-2 px-1 ${
            activeTab === "inactive"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Inactive
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-2 px-1 ${
            activeTab === "pending"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Pending
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => (
          <div
            key={feature.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">{feature.icon}</div>
                <h3 className="font-medium text-gray-900">{feature.title}</h3>
              </div>
              {getStatusIcon(feature.status)}
            </div>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                <span className="font-medium">Last Run:</span> {feature.lastRun}
              </div>
              <div>
                <span className="font-medium">Next Run:</span> {feature.nextRun}
              </div>
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200">
              <Zap className="w-4 h-4" />
              <span>Configure</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutomationPage;