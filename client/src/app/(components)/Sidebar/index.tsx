"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  Archive,
  BarChart,
  BrainCircuit,
  Check,
  CircleDollarSign,
  Clipboard,
  ChevronRight,
  FileBarChartIcon,
  FilePieChart,
  Layout,
  LucideIcon,
  Menu,
  Mic,
  NotepadText,
  Package,
  User,
  UserPen,
  Workflow,
  X,
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
  onMobileClick?: () => void;
}

const SidebarLink = ({ href, icon: Icon, label, isCollapsed, onMobileClick }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} onClick={onMobileClick}>
      <div
        className={`cursor-pointer flex items-center ${isCollapsed ? "justify-center py-3" : "px-4 py-3"} hover:text-blue-500 hover:bg-blue-50 gap-3 transition-all duration-200 rounded-lg mx-2 ${isActive ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600"}`}
      >
        <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
        <span className={`${isCollapsed ? "hidden" : "block"} text-sm`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

interface SidebarSectionProps {
  title: string;
  isCollapsed: boolean;
  children: React.ReactNode;
}

const SidebarSection = ({ title, isCollapsed, children }: SidebarSectionProps) => {
  return (
    <div className="mb-6">
      {!isCollapsed && (
        <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Menu Button - Only visible when sidebar is closed */}
      {isMobile && !isMobileMenuOpen && (
        <button
          className="fixed top-12 z-50 p-1 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed flex flex-col ${
          isMobile 
            ? `${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
            : `${isSidebarCollapsed ? "w-16" : "w-64"}`
        } bg-white transition-all duration-300 overflow-hidden h-full shadow-lg z-40 border-r border-gray-100`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b border-gray-100`}>
          <div className="flex items-center gap-2">
            <h1 className={`${isSidebarCollapsed && !isMobile ? "hidden" : "block"} text-3xl font-bold text-gray-600`}>Reorbe</h1>
          </div>
          {!isMobile && (
            <button 
              className="p-1.5 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
              onClick={toggleSidebar}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="w-4 h-4 text-gray-600" />
            </button>
          )}
          {isMobile && (
            <button 
              className="p-1.5 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-grow overflow-y-auto py-4">
          {/* Dashboard Section */}
          <SidebarSection title="Main" isCollapsed={isSidebarCollapsed && !isMobile}>
            <SidebarLink href="/dashboard" icon={Layout} label="Dashboard" isCollapsed={isSidebarCollapsed && !isMobile} onMobileClick={closeMobileMenu} />
          </SidebarSection>

          {/* Sales Section */}
          <SidebarSection title="Sales" isCollapsed={isSidebarCollapsed && !isMobile}>
            <SidebarLink href="/Invoices" icon={NotepadText} label="Invoices" isCollapsed={isSidebarCollapsed && !isMobile} onMobileClick={closeMobileMenu} />
            <SidebarLink href="/orders" icon={Package} label="Orders" isCollapsed={isSidebarCollapsed && !isMobile} onMobileClick={closeMobileMenu} />
          </SidebarSection>

          {/* Inventory Section */}
          <SidebarSection title="Products" isCollapsed={isSidebarCollapsed && !isMobile}>
            <SidebarLink href="/inventory" icon={Archive} label="Inventory" isCollapsed={isSidebarCollapsed && !isMobile} onMobileClick={closeMobileMenu} />
            <SidebarLink href="/suppliers" icon={UserPen} label="Suppliers" isCollapsed={isSidebarCollapsed && !isMobile} onMobileClick={closeMobileMenu} />
          </SidebarSection>

          {/* Customers Section */}
          <SidebarSection title="Customers" isCollapsed={isSidebarCollapsed && !isMobile}>
            <SidebarLink href="/users" icon={User} label="Customers" isCollapsed={isSidebarCollapsed && !isMobile} onMobileClick={closeMobileMenu} />
          </SidebarSection>

          {/* Finance Section */}
          <SidebarSection title="Finance" isCollapsed={isSidebarCollapsed && !isMobile}>
            <SidebarLink href="/expenses" icon={FilePieChart} label="Expenses" isCollapsed={isSidebarCollapsed && !isMobile} onMobileClick={closeMobileMenu} />
            <SidebarLink href="/reports" icon={FileBarChartIcon} label="Reports" isCollapsed={isSidebarCollapsed && !isMobile} onMobileClick={closeMobileMenu} />
          </SidebarSection>

          {/* Automation Section */}
          <SidebarSection title="Tools" isCollapsed={isSidebarCollapsed && !isMobile}>
            <SidebarLink href="/automation" icon={Workflow} label="Automation" isCollapsed={isSidebarCollapsed && !isMobile} onMobileClick={closeMobileMenu} />
          </SidebarSection>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex justify-center items-center">
            {/* AI Assistant button removed as it's now in the navbar */}
          </div>
          {(!isSidebarCollapsed || isMobile) && (
            <p  className="text-center text-xs text-gray-400 mt-4">
            &copy; {new Date().getFullYear()} Reorbe Inc.</p>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};

export default Sidebar;
