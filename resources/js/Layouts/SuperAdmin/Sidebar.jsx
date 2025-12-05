import React, { useState, useEffect } from "react";
import { useTheme } from "../../Context/ThemeContext";
import { Link, router } from "@inertiajs/react";

export default function Sidebar({ open = true, onToggle }) {
    const { darkMode, toggleDarkMode } = useTheme();
    const currentRoute = window.location.pathname;
    const [openMenus, setOpenMenus] = useState({});
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Automatically open menus if the current route matches a submenu
    useEffect(() => {
        const menusToOpen = {};
        if (currentRoute.startsWith("/superadmin/corporate")) {
            menusToOpen.corporate = true;
        }
        if (currentRoute.startsWith("/superadmin/wellness")) {
            menusToOpen.wellness = true;
        }
        if (currentRoute.startsWith("/superadmin/marketing")) {
            menusToOpen.marketing = true;
        }
        if (currentRoute.startsWith("/superadmin/policy")) {
            menusToOpen.policy = true;
        }
        if (currentRoute.startsWith("/superadmin/admin")) {
            menusToOpen.admin = true;
        }
        setOpenMenus(menusToOpen);
    }, [currentRoute]);

    // Toggle submenu open/close and close other submenus
    const toggleMenu = (menuKey) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menuKey]: !prev[menuKey],
        }));
    };

    // Sidebar classes for overlay on mobile, static on md+
    const sidebarBase =
        "h-full w-60 md:w-64 flex-col font-montserrat border-r border-[#E6E8F5] transition-all duration-300 z-30";
    const sidebarMobile = open
        ? "fixed top-0 left-0 flex shadow-2xl md:static md:shadow-none"
        : "fixed top-0 -left-64 flex md:static md:left-0 md:flex";

    return (
        <>
            {/* Mobile menu button (toggle) - always visible on mobile */}
            <div
                className={`md:hidden fixed top-4 z-50 transition-all duration-300 ${
                    open ? "left-60 md:left-64" : "left-0"
                }`}
                style={{ pointerEvents: "auto" }}
            >
                <button
                    className={`p-2 rounded-r-lg bg-[#934790] text-white hover:bg-[#6A0066] transition-colors duration-200 shadow-lg`}
                    onClick={onToggle}
                    aria-label={open ? "Close sidebar" : "Open sidebar"}
                >
                    <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        {open ? (
                            <path d="M15 18l-6-6 6-6" /> // left arrow
                        ) : (
                            <path d="M9 6l6 6-6 6" /> // right arrow
                        )}
                    </svg>
                </button>
            </div>
            <aside
                className={`${sidebarBase} ${sidebarMobile} ${
                    darkMode
                        ? "bg-gray-900 text-white"
                        : "bg-[#F5F6FF] text-black"
                } overflow-y-auto`} 
                style={{ minHeight: "100vh", maxHeight: "100vh" }}
            >
                {/* Logo */}

                <div className="flex items-center justify-center h-20 md:h-28 mb-2">
                    <img
                        src="/assets/logo/zoom_connect_logo.png"
                        alt="Zoom Connect Logo"
                        className="h-16 md:h-20 w-auto max-w-[200px]"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/logo/fallback-logo.png"; // fallback image
                        }}
                    />
                </div>

                {/* Menu */}
                <nav className="flex-1 pt-2 pb-4">
                    <ul className="space-y-1">
                        {/* Dashboard */}
                        <li>
                            <Link
                                href="/superadmin/dashboard"
                                className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[13px] transition-colors duration-200 ${
                                    currentRoute === "/superadmin/dashboard"
                                        ? "bg-[#E6E8F5] text-[#934790] rounded-lg"
                                        : `hover:bg-[#E6E8F5] hover:text-[#934790] ${
                                              darkMode
                                                  ? "text-white"
                                                  : "text-black"
                                          } rounded-lg`
                                }`}
                            >
                                <span className="w-5 h-5 flex items-center justify-center">
                                    <svg
                                        width="22"
                                        height="22"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                </span>
                                <span>Dashboard</span>
                            </Link>
                        </li>

                        {/* Corporate Menu with Submenu */}
                        <li>
                            <button
                                onClick={() => toggleMenu("corporate")}
                                className={`w-full flex items-center justify-between gap-3 px-7 py-2 font-montserrat font-medium text-[13px] transition-colors duration-200 ${
                                    openMenus.corporate
                                        ? "bg-[#E6E8F5] text-[#934790] rounded-lg"
                                        : `hover:bg-[#E6E8F5] hover:text-[#934790] ${
                                              darkMode
                                                  ? "text-white"
                                                  : "text-black"
                                          } rounded-lg`
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <svg
                                            width="22"
                                            height="22"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                                        </svg>
                                    </span>
                                    <span>Corporate</span>
                                </div>
                                <svg
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    className={`transition-transform duration-200 ${
                                        openMenus.corporate ? "rotate-180" : ""
                                    }`}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {/* Submenu */}
                            {openMenus.corporate && (
                                <ul className="ml-4 mt-1 space-y-1">
                                    <li>
                                        <Link
                                            href="/superadmin/corporate/list"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/corporate/list"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/corporate/list"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Corporate List</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/superadmin/corporate/labels"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/corporate/labels"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/corporate/labels"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Corporate Labels</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/superadmin/corporate/groups"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/corporate/groups"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/corporate/groups"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Corporate Groups</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Wellness Menu with Submenu */}
                        <li>
                            <button
                                onClick={() => toggleMenu("wellness")}
                                className={`w-full flex items-center justify-between gap-3 px-7 py-2 font-montserrat font-medium text-[13px] transition-colors duration-200 ${
                                    openMenus.wellness ||
                                    currentRoute.startsWith(
                                        "/superadmin/wellness"
                                    )
                                        ? "bg-[#E6E8F5] text-[#934790] rounded-lg"
                                        : `hover:bg-[#E6E8F5] hover:text-[#934790] ${
                                              darkMode
                                                  ? "text-white"
                                                  : "text-black"
                                          } rounded-lg`
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Wellness SVG (same behavior as Dashboard) */}
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 64 64"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            width="22"
                                            height="22"
                                        >
                                            <path d="M32 52s-18-10.5-20-23a11 11 0 0 1 20-6 11 11 0 0 1 20 6c-2 12.5-20 23-20 23z" />
                                            <path d="M12 34h6l3-8 4 16 4-10 4 6h6" />
                                        </svg>
                                    </span>
                                    <span>Wellness</span>
                                </div>

                                {/* Dropdown Arrow */}
                                <svg
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    className={`transition-transform duration-200 ${
                                        openMenus.wellness ? "rotate-180" : ""
                                    }`}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {/* Submenu */}
                            {openMenus.wellness && (
                                <ul className="ml-4 mt-1 space-y-1">
                                    <li>
                                        <Link
                                            href="/superadmin/wellness/vendor-list"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/wellness/vendor-list"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/wellness/vendor-list"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Vendor List</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/superadmin/wellness/category-list"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/wellness/category-list"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/wellness/category-list"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Category List</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/superadmin/wellness/services"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/wellness/services"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/wellness/services"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Wellness Services</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Marketing Menu with Submenu */}
                        <li>
                            <button
                                onClick={() => toggleMenu("marketing")}
                                className={`w-full flex items-center justify-between gap-3 px-7 py-2 font-montserrat font-medium text-[13px] transition-colors duration-200 ${
                                    openMenus.marketing ||
                                    currentRoute.startsWith(
                                        "/superadmin/marketing"
                                    )
                                        ? "bg-[#E6E8F5] text-[#934790] rounded-lg"
                                        : `hover:bg-[#E6E8F5] hover:text-[#934790] ${
                                              darkMode
                                                  ? "text-white"
                                                  : "text-black"
                                          } rounded-lg`
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <svg
                                            width="22"
                                            height="22"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                            <path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
                                            <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                                            <path d="M12 11h.01" />
                                        </svg>
                                    </span>
                                    <span>Marketing</span>
                                </div>

                                <svg
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    className={`transition-transform duration-200 ${
                                        openMenus.marketing ? "rotate-180" : ""
                                    }`}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {/* Submenu */}
                            {openMenus.marketing && (
                                <ul className="ml-4 mt-1 space-y-1">
                                    <li>
                                        <Link
                                            href="/superadmin/marketing/campaigns"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/marketing/campaigns"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/marketing/campaigns"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Campaigns</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/superadmin/marketing/welcome-mailer"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/marketing/welcome-mailer"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/marketing/welcome-mailer"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Welcome Mailer</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/superadmin/marketing/message-template"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/marketing/message-template"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/marketing/message-template"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Message Template</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/superadmin/marketing/push-notifications"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/marketing/push-notifications"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/marketing/push-notifications"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Push Notifications</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Policy Menu with Submenu */}
                        <li>
                            <button
                                onClick={() => toggleMenu("policy")}
                                className={`w-full flex items-center justify-between gap-3 px-7 py-2 font-montserrat font-medium text-[13px] transition-colors duration-200 ${
                                    openMenus.policy ||
                                    currentRoute.startsWith(
                                        "/superadmin/policy"
                                    )
                                        ? "bg-[#E6E8F5] text-[#934790] rounded-lg"
                                        : `hover:bg-[#E6E8F5] hover:text-[#934790] ${
                                              darkMode
                                                  ? "text-white"
                                                  : "text-black"
                                          } rounded-lg`
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <svg
                                            width="22"
                                            height="22"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                            <polyline points="14,2 14,8 20,8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10,9 9,9 8,9" />
                                        </svg>
                                    </span>
                                    <span>Policy</span>
                                </div>

                                <svg
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    className={`transition-transform duration-200 ${
                                        openMenus.policy ? "rotate-180" : ""
                                    }`}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {/* Submenu */}
                            {openMenus.policy && (
                                <ul className="ml-4 mt-1 space-y-1">
                                    <li>
                                        <Link
                                            href="/superadmin/policy/enrollment-lists"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/policy/enrollment-lists"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/policy/enrollment-lists"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Enrollment Lists</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/superadmin/policy/policy-users"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/policy/policy-users"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/policy/policy-users"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Policy Users</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/superadmin/policy/policies"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/policy/policies"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/policy/policies"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Policies</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/superadmin/policy/endorsements"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute === "/superadmin/policy/endorsements"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode ? "text-gray-300" : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute === "/superadmin/policy/endorsements"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Endorsements</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/superadmin/policy/cd-accounts"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/policy/cd-accounts"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/policy/cd-accounts"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>CD Accounts</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/superadmin/policy/insurance"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/policy/insurance"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/policy/insurance"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>Insurance</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/superadmin/policy/tpa"
                                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                                currentRoute ===
                                                "/superadmin/policy/tpa"
                                                    ? "text-[#934790]"
                                                    : `hover:text-[#934790] ${
                                                          darkMode
                                                              ? "text-gray-300"
                                                              : "text-gray-600"
                                                      }`
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    currentRoute ===
                                                    "/superadmin/policy/tpa"
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            <span>TPA</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Admin Menu with Submenu */}
                        <li>
                            <button
                                onClick={() => toggleMenu("admin")}
                                className={`w-full flex items-center justify-between gap-3 px-7 py-2 font-montserrat font-medium text-[13px] transition-colors duration-200 ${
                                    openMenus.admin || currentRoute.startsWith("/superadmin/admin")
                                        ? "bg-[#E6E8F5] text-[#934790] rounded-lg"
                                        : `hover:bg-[#E6E8F5] hover:text-[#934790] ${
                                              darkMode ? "text-white" : "text-black"
                                          } rounded-lg`
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        {/* Gear / Cog icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M11.983 1.5a1 1 0 01.99.858l.21 1.7a8.001 8.001 0 012.121.744l1.528-.493a1 1 0 01.93 1.773l-1.203.78a8.02 8.02 0 010 2.388l1.203.78a1 1 0 01-.93 1.773l-1.528-.493a8.001 8.001 0 01-2.121.744l-.21 1.7a1 1 0 01-.99.858h-1.98a1 1 0 01-.99-.858l-.21-1.7a8.001 8.001 0 01-2.121-.744l-1.528.493a1 1 0 01-.93-1.773l1.203-.78a8.02 8.02 0 010-2.388l-1.203-.78a1 1 0 01.93-1.773l1.528.493a8.001 8.001 0 012.121-.744l.21-1.7A1 1 0 019.992 1.5h1.98zM12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
                                        </svg>
                                    </span>
                                    <span>Admin</span>
                                </div>

                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`transition-transform duration-200 ${openMenus.admin ? "rotate-180" : ""}`}>
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {/* Submenu */}
                            {openMenus.admin && (
                                <ul className="ml-4 mt-1 space-y-1">
                                    <li>
                                        <Link href="/superadmin/admin/resources" className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                            currentRoute === "/superadmin/admin/resources" ? "text-[#934790]" : `hover:text-[#934790] ${darkMode ? "text-gray-300" : "text-gray-600"}`
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${currentRoute === "/superadmin/admin/resources" ? "bg-[#934790]" : "bg-gray-400"}`}></span>
                                            <span>Resources</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/superadmin/admin/blogs" className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                            currentRoute === "/superadmin/admin/blogs" ? "text-[#934790]" : `hover:text-[#934790] ${darkMode ? "text-gray-300" : "text-gray-600"}`
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${currentRoute === "/superadmin/admin/blogs" ? "bg-[#934790]" : "bg-gray-400"}`}></span>
                                            <span>Blogs</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/superadmin/admin/faqs" className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                            currentRoute === "/superadmin/admin/faqs" ? "text-[#934790]" : `hover:text-[#934790] ${darkMode ? "text-gray-300" : "text-gray-600"}`
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${currentRoute === "/superadmin/admin/faqs" ? "bg-[#934790]" : "bg-gray-400"}`}></span>
                                            <span>Faqs</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/superadmin/admin/surveys" className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                            currentRoute === "/superadmin/admin/surveys" ? "text-[#934790]" : `hover:text-[#934790] ${darkMode ? "text-gray-300" : "text-gray-600"}`
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${currentRoute === "/superadmin/admin/surveys" ? "bg-[#934790]" : "bg-gray-400"}`}></span>
                                            <span>Surveys</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>

                {/* Help & Logout */}
                <div className="px-7 pb-4 mt-auto">
                    <a
                        href="#help"
                        className={`flex items-center gap-3 py-2 font-montserrat font-normal text-[12px] ${
                            darkMode
                                ? "text-gray-400 hover:text-white"
                                : "text-[#A0A3BD] hover:text-[#934790]"
                        }`}
                    >
                        <svg
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 115.82 0c0 2-3 3-3 3" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <span>Help</span>
                    </a>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowLogoutModal(true);
                        }}
                        className={`flex items-center gap-3 py-2 font-montserrat font-normal text-[12px] w-full ${
                            darkMode
                                ? "text-gray-400 hover:text-white"
                                : "text-[#A0A3BD] hover:text-[#934790]"
                        }`}
                    >
                        <svg
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
                            <path d="M3 21V3a2 2 0 012-2h6a2 2 0 012 2v4" />
                        </svg>
                        <span>Log out</span>
                    </button>
                </div>

                {/* Dark mode toggle */}
                <div className="px-7 pb-6 flex items-center gap-3">
                    <span className="text-xs font-medium font-montserrat">
                        Dark Mode
                    </span>
                    <button
                        onClick={toggleDarkMode}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                            darkMode ? "bg-[#934790]" : "bg-gray-300"
                        }`}
                    >
                        <span
                            className={`h-5 w-5 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${
                                darkMode
                                    ? "translate-x-6 bg-[#22223B]"
                                    : "bg-white"
                            }`}
                        >
                            {darkMode ? (
                                <svg
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke="#FFD700"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                                </svg>
                            ) : (
                                <svg
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke="#FFD700"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                            )}
                        </span>
                    </button>
                </div>
                {/* Logout Confirmation Modal */}
                {showLogoutModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className={`rounded-lg p-6 max-w-md w-full mx-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
                            <p className="text-sm mb-6">Are you sure you want to log out?</p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => router.post(route('logout'))}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                                >
                                    Log out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
