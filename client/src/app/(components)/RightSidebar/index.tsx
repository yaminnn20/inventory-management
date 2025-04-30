'use client';

import { useState } from "react";
import { X } from "lucide-react";

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const RightSidebar = ({ isOpen, onClose }: RightSidebarProps) => {
  return (
    <div
      className={`fixed top-2 right-2 h-full w-80 bg-white rounded-md shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Get Started</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Quick Setup Guide</h3>
            <p className="text-gray-600">
              Let&apos;s get your inventory management system up and running in just a few steps.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Add Your Products</h4>
                <p className="text-sm text-gray-600">
                  Start by adding your products to the inventory system.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Set Up Suppliers</h4>
                <p className="text-sm text-gray-600">
                  Add your suppliers to manage purchase orders and track expenses.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Configure Settings</h4>
                <p className="text-sm text-gray-600">
                  Customize your inventory settings and preferences.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
