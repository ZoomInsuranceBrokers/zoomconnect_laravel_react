import React, { useState, useEffect } from 'react';
import { useTheme } from '../../Context/ThemeContext';
import { Link } from '@inertiajs/react';

export default function Sidebar({ open = true, onToggle }) {
    const { darkMode, toggleDarkMode } = useTheme();
    const currentRoute = window.location.pathname;
    const [openMenus, setOpenMenus] = useState({});

    // Automatically open menus if the current route matches a submenu
    useEffect(() => {
        const menusToOpen = {};
        if (currentRoute.startsWith('/superadmin/corporate')) {
            menusToOpen.corporate = true;
        }
        setOpenMenus(menusToOpen);
    }, [currentRoute]);

    // Toggle submenu open/close
    const toggleMenu = (menuKey) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menuKey]: !prev[menuKey],
        }));
    };

    // Sidebar classes for overlay on mobile, static on md+
    const sidebarBase = 'h-full w-60 md:w-64 flex-col font-montserrat border-r border-[#E6E8F5] transition-all duration-300 z-30';
    const sidebarMobile = open
        ? 'fixed top-0 left-0 flex shadow-2xl md:static md:shadow-none'
        : 'fixed top-0 -left-64 flex md:static md:left-0 md:flex';

    return (
        <>
            {/* Mobile menu button (toggle) - always visible on mobile */}
            <div className={`md:hidden fixed top-4 z-50 transition-all duration-300 ${open ? 'left-60 md:left-64' : 'left-0'}`} style={{ pointerEvents: 'auto' }}>
                <button
                    className={`p-2 rounded-r-lg bg-[#934790] text-white hover:bg-[#6A0066] transition-colors duration-200 shadow-lg`}
                    onClick={onToggle}
                    aria-label={open ? 'Close sidebar' : 'Open sidebar'}
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {open ? (
                            <path d="M15 18l-6-6 6-6" /> // left arrow
                        ) : (
                            <path d="M9 6l6 6-6 6" /> // right arrow
                        )}
                    </svg>
                </button>
            </div>
            <aside
                className={`${sidebarBase} ${sidebarMobile} ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#F5F6FF] text-black'}`}
                style={{ minHeight: '100vh' }}
            >
            {/* Logo */}
            <div className="flex items-center justify-center h-16 md:h-24 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5B6FFF] to-[#A685FA] flex items-center justify-center mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity=".15" />
                    </svg>
                </div>
                <span className="text-lg font-bold tracking-wide font-montserrat">
                    <span className="text-[#5B6FFF]">Zoom</span>
                    <span className={darkMode ? 'text-white' : 'text-[#22223B]'}>Connect</span>
                </span>
            </div>



            {/* Menu */}
            <nav className="flex-1 pt-2 pb-4">
                <ul className="space-y-1">
                    {/* Dashboard */}
                    <li>
                        <Link
                            href="/superadmin/dashboard"
                            className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[13px] transition-colors duration-200 ${
                                currentRoute === '/superadmin/dashboard'
                                    ? 'bg-[#E6E8F5] text-[#934790] rounded-lg'
                                    : `hover:bg-[#E6E8F5] hover:text-[#934790] ${
                                          darkMode ? 'text-white' : 'text-black'
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
                            onClick={() => toggleMenu('corporate')}
                            className={`w-full flex items-center justify-between gap-3 px-7 py-2 font-montserrat font-medium text-[13px] transition-colors duration-200 ${
                                openMenus.corporate
                                    ? 'bg-[#E6E8F5] text-[#934790] rounded-lg'
                                    : `hover:bg-[#E6E8F5] hover:text-[#934790] ${
                                          darkMode ? 'text-white' : 'text-black'
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
                                    openMenus.corporate ? 'rotate-180' : ''
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
                                            currentRoute === '/superadmin/corporate/list'
                                                ? 'text-[#934790]'
                                                : `hover:text-[#934790] ${
                                                      darkMode ? 'text-gray-300' : 'text-gray-600'
                                                  }`
                                        }`}
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full ${
                                                currentRoute === '/superadmin/corporate/list'
                                                    ? 'bg-[#934790]'
                                                    : 'bg-gray-400'
                                            }`}
                                        ></span>
                                        <span>Corporate List</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/superadmin/corporate/labels"
                                        className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                            currentRoute === '/superadmin/corporate/labels'
                                                ? 'text-[#934790]'
                                                : `hover:text-[#934790] ${
                                                      darkMode ? 'text-gray-300' : 'text-gray-600'
                                                  }`
                                        }`}
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full ${
                                                currentRoute === '/superadmin/corporate/labels'
                                                    ? 'bg-[#934790]'
                                                    : 'bg-gray-400'
                                            }`}
                                        ></span>
                                        <span>Corporate Labels</span>
                                    </Link>
                                </li>
                                  <li>
                                    <Link
                                        href="/superadmin/corporate/groups"
                                        className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[12px] transition-colors duration-200 ${
                                            currentRoute === '/superadmin/corporate/groups'
                                                ? 'text-[#934790]'
                                                : `hover:text-[#934790] ${
                                                      darkMode ? 'text-gray-300' : 'text-gray-600'
                                                  }`
                                        }`}
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full ${
                                                currentRoute === '/superadmin/corporate/groups'
                                                    ? 'bg-[#934790]'
                                                    : 'bg-gray-400'
                                            }`}
                                        ></span>
                                        <span>Corporate Groups</span>
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
                        darkMode ? 'text-gray-400 hover:text-white' : 'text-[#A0A3BD] hover:text-[#934790]'
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
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className={`flex items-center gap-3 py-2 font-montserrat font-normal text-[12px] w-full ${
                        darkMode ? 'text-gray-400 hover:text-white' : 'text-[#A0A3BD] hover:text-[#934790]'
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
                </Link>
            </div>

            {/* Dark mode toggle */}
            <div className="px-7 pb-6 flex items-center gap-3">
                <span className="text-xs font-medium font-montserrat">Dark Mode</span>
                <button
                    onClick={toggleDarkMode}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                        darkMode ? 'bg-[#934790]' : 'bg-gray-300'
                    }`}
                >
                    <span
                        className={`h-5 w-5 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${
                            darkMode ? 'translate-x-6 bg-[#22223B]' : 'bg-white'
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
            {/* ...existing code... */}
            </aside>
        </>
    );
}
