"use client";

import React from "react";
import { BadgeInfo } from "lucide-react";

interface GetStartedButtonProps {
  onClick: () => void;
}

const GetStartedButton = ({ onClick }: GetStartedButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 z-40"
    >
      <BadgeInfo size={20} />
      <span className="hidden sm:inline">Get Started</span>
    </button>
  );
};

export default GetStartedButton; 