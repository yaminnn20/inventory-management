"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode } from "@/state";
import {
  Bell,
  BotMessageSquare,
  BrainCog,
  Moon,
  Search,
  Settings,
  Sun,
  X,
  Package,
  Users,
  FileText,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  type: 'product' | 'user' | 'order' | 'invoice';
  title: string;
  description: string;
  link: string;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Navbar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "New Order Received",
      message: "Order #1234 has been placed successfully",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Low Stock Alert",
      message: "Product 'Widget X' is running low on stock",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "info",
      title: "New User Registration",
      message: "John Smith has registered as a new customer",
      time: "3 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "success",
      title: "Payment Received",
      message: "Invoice #5678 has been paid",
      time: "5 hours ago",
      read: true,
    },
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIframeSrc("https://deepgrovee-main.vercel.app");

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // TODO: Replace with actual API calls to search endpoints
    // This is a mock implementation
    const mockResults: SearchResult[] = [
      {
        id: "1",
        type: "product" as const,
        title: "Product 1",
        description: "Description for Product 1",
        link: "/products",
      },
      {
        id: "2",
        type: "user" as const,
        title: "John Doe",
        description: "Customer",
        link: "/users",
      },
      {
        id: "3",
        type: "order" as const,
        title: "Order #123",
        description: "Pending order",
        link: "/orders",
      },
      {
        id: "4",
        type: "invoice" as const,
        title: "Invoice #456",
        description: "Paid invoice",
        link: "/invoices",
      },
    ].filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(mockResults);
  };

  const getIconForType = (type: SearchResult['type']) => {
    switch (type) {
      case 'product':
        return <Package size={16} className="text-blue-500" />;
      case 'user':
        return <Users size={16} className="text-green-500" />;
      case 'order':
        return <ShoppingCart size={16} className="text-purple-500" />;
      case 'invoice':
        return <FileText size={16} className="text-orange-500" />;
      default:
        return <Search size={16} className="text-gray-500" />;
    }
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('Error requesting microphone permission:', err);
    }
  };

  const toggleChat = () => {
    setIsChatVisible((prev) => !prev);
    if (!isChatOpen) {
      setIsChatOpen(true);
      if (isMobile) {
        requestMicrophonePermission();
      }
    }
  };

  const closeChat = () => setIsChatVisible(false);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'warning':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'info':
        return <Clock size={16} className="text-blue-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* NAVBAR */}
      <div className="flex justify-between items-center w-full mb-7 bg-white rounded-xl shadow-sm p-3">
        {/* LEFT: Search and Chat */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div ref={searchRef} className="relative">
            {/* Search input for all screens */}
            <div className="relative">
              {isMobile ? (
                <>
                  {!isSearchExpanded ? (
                    <button
                      onClick={() => setIsSearchExpanded(true)}
                      className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none border border-gray-200 shadow-sm"
                    >
                      <Search size={18} className="text-gray-600" />
                    </button>
                  ) : (
                    <div className="flex items-center">
                      <input
                        type="search"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          handleSearch(e.target.value);
                        }}
                        onFocus={() => setIsSearchFocused(true)}
                        className="pl-11 pr-4 py-2.5 w-full border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          setIsSearchExpanded(false);
                          setIsSearchFocused(false);
                          setSearchQuery("");
                        }}
                        className="absolute right-2 p-1 rounded-full hover:bg-gray-100"
                      >
                        <X size={18} className="text-gray-500" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  className="pl-11 pr-4 py-2.5 w-full md:w-80 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              {!isMobile || isSearchExpanded ? (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
              ) : null}
            </div>

            {/* Search Results Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={result.link}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setIsSearchFocused(false);
                        setSearchQuery("");
                      }}
                    >
                      {getIconForType(result.type)}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{result.title}</div>
                        <div className="text-sm text-gray-500">{result.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat Button */}
          <button
            onClick={toggleChat}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors duration-200"
          >
            <BrainCog size={16} />
            <span className="font-medium text-sm">Orbe AI</span>
            {isChatOpen && (
              <span className="w-2 h-2 bg-gray-100 rounded-full animate-pulse" />
            )}
          </button>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-4">
          {/* Profile */}
          <div className="relative">
            <Image
              src="https://r1-inventorymanagement.s3.us-east-1.amazonaws.com/profile.png"
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full object-cover ring-2 ring-gray-200"
            />
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white" />
          </div>

          {/* Notification */}
          <div ref={notificationRef} className="relative">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2.5 rounded-lg hover:bg-gray-100 focus:outline-none relative"
            >
              <Bell size={22} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 p-3 border-b border-gray-100 last:border-0 ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{notification.title}</div>
                        <div className="text-sm text-gray-500">{notification.message}</div>
                        <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setNotifications(notifications.map(n => ({ ...n, read: true })));
                      setIsNotificationOpen(false);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <Link
            href="/settings"
            className="p-2.5 rounded-lg hover:bg-gray-100 focus:outline-none"
          >
            <Settings size={22} className="text-gray-600 hover:text-blue-500" />
          </Link>
        </div>
      </div>

      {/* CHAT WINDOW (Both Desktop and Mobile) */}
      <div
        className={`fixed bg-white shadow-xl transition-all duration-300 z-50 ${
          isChatVisible ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
        } ${
          isMobile
            ? "top-20 left-1/2 -translate-x-1/2 w-[95%] h-[70%] rounded-xl"
            : "top-20 right-4 w-[90vw] md:w-[700px] h-[80vh] md:h-[500px] rounded-xl"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-700">AI Assistant</h3>
          <button
            onClick={closeChat}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Iframe */}
        <div className="w-full h-[calc(100%-48px)]">
          {isChatVisible && (
            <iframe
              ref={iframeRef}
              key={isMobile ? 'mobile' : 'desktop'}
              src={iframeSrc}
              allow="microphone; camera; autoplay"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals allow-microphone"
              loading="lazy"
              className="w-full h-full border-none"
              style={{
                touchAction: "manipulation",
                WebkitOverflowScrolling: "touch",
                pointerEvents: "auto",
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
