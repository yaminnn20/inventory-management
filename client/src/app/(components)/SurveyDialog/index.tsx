"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const SurveyDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldReappear, setShouldReappear] = useState(false);

  // Initial timer to show the dialog
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setIsOpen(true);
    }, 2 * 60 * 1000); // 2 minutes in milliseconds

    return () => clearTimeout(initialTimer);
  }, []);

  // Timer to show the dialog again after clicking "Maybe Later"
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!isOpen && shouldReappear) {
      timer = setTimeout(() => {
        setIsOpen(true);
        setShouldReappear(false);
      }, 2 * 60 * 1000); // 2 minutes in milliseconds
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, shouldReappear]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Enjoying Our Website?
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;d love to hear your feedback! Please take a moment to complete our
            quick survey and help us improve your experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                window.open("https://reorbe.com", "_blank");
                setIsOpen(false);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Take Survey
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setShouldReappear(true);
              }}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyDialog; 