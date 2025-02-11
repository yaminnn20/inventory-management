"use client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  Archive,
  BarChart,
  BotMessageSquare,
  BrainCircuit,
  Check,
  CircleDollarSign,
  Clipboard,
  FileBarChartIcon,
  FilePieChart,
  Layout,
  LucideIcon,
  Menu,
  Mic,
  NotepadText,
  Package,
  SlidersHorizontal,
  User,
  UserPen,
  Workflow,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({ href, icon: Icon, label, isCollapsed }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${isCollapsed ? "justify-center py-3" : "px-4 py-3.5"} hover:text-blue-500 hover:bg-blue-100 gap-2 transition-colors ${isActive ? "bg-blue-200 text-white" : ""}`}
      >
        <Icon className="w-4 h-4 !text-gray-700" />
        <span className={`${isCollapsed ? "hidden" : "block"} text-sm font-medium text-gray-700`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string>("");

  const toggleSidebar = () => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
    if (!isChatOpen) {
      setIframeSrc("https://deepgrovee.vercel.app");
      setIsChatOpen(true);
    }
  };
  const closeChat = () => setIsChatVisible(false);

  return (
    <div className={`fixed flex flex-col ${isSidebarCollapsed ? "w-14" : "w-60"} bg-white transition-all duration-200 overflow-hidden h-full shadow-md z-40`}>
      <div className={`flex items-center pt-4 ${isSidebarCollapsed ? "px-3" : "px-4"}`}>
        <Image src="https://s3-inventorymanagement.s3.us-east-2.amazonaws.com/logo.png" alt="edstock-logo" width={24} height={24} className="rounded" />
        <h1 className={`${isSidebarCollapsed ? "hidden" : "block"} text-xl font-bold ml-2`}>REORBE</h1>
        <button className="md:hidden p-2 bg-gray-100 rounded hover:bg-blue-100" onClick={toggleSidebar}>
          <Menu className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-grow mt-5">
        <SidebarLink href="/dashboard" icon={Layout} label="Dashboard" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/Invoices" icon={NotepadText} label="Invoices" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/inventory" icon={Archive} label="Inventory" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/products" icon={Clipboard} label="Products" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/suppliers" icon={UserPen} label="Suppliers" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/orders" icon={Package} label="Orders" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/users" icon={User} label="Customers" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/automation" icon={Workflow} label="Automation" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/expenses" icon={FilePieChart} label="Expenses" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/reports" icon={FileBarChartIcon} label="Reports" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/settings" icon={SlidersHorizontal} label="Settings" isCollapsed={isSidebarCollapsed} />
      </div>

      <div className="flex justify-center items-center mb-11">
        <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-200 shadow-lg relative" onClick={toggleChat}>
          <BotMessageSquare className="w-9 h-9" />
          {isChatOpen && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
        </button>
        {!isSidebarCollapsed && <span className="text-gray-700 font-medium text-sm ml-2">ORBE</span>}
      </div>

      <div className={`fixed bottom-12 left-12 bg-white rounded-lg shadow-lg w-[700px] h-[500px] transition-all duration-200 ${isChatVisible ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <button className="absolute top-1 right-2 text-gray-700 text-lg" onClick={closeChat}>
          ✖
        </button>
        <iframe
          src={iframeSrc}
          allow="microphone"
          className={`w-full h-full rounded-lg border-none bg-white transition-opacity duration-200 ${isChatVisible ? "opacity-100" : "opacity-0"}`}
        ></iframe>
      </div>

      <p className={`${isSidebarCollapsed ? "hidden" : "block"} text-center text-xs text-gray-500 mb-2`}>&copy; 2025 REORBE</p>
    </div>
  );
};

export default Sidebar;
