import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    HeartIcon,
    QuestionMarkCircleIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function EmployeeLayout({ children, employee }) {
    const { url } = usePage();
    const [hoveredIcon, setHoveredIcon] = useState(null);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, route: '/employee/dashboard' },
        { id: 'wellness', label: 'Wellness', icon: HeartIcon, route: '/employee/wellness' },
        { id: 'claims', label: 'Claims', icon: DocumentTextIcon, route: '/employee/claims' },
        { id: 'policy', label: 'Policy', icon: ShieldCheckIcon, route: '/employee/policy' },
        { id: 'help', label: 'Help', icon: QuestionMarkCircleIcon, route: '/employee/help' },
    ];

    const handleLogout = async () => {
        try {
            const response = await fetch('/employee/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
            });

            if (response.ok) {
                window.location.href = '/employee-login';
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const isActive = (route) => {
        return url === route || url.startsWith(route);
    };

    return (
        <>
            {/* Global scrollbar-hide styles and animations */}
            <style dangerouslySetInnerHTML={{ __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out forwards;
                }
            `}} />
            
            <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
                {/* Mobile Header - Shows on small screens */}
                <header className="lg:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between z-10">
                    <Link href="/employee/dashboard" className="flex items-center">
                        <img
                            src="/assets/images/Purple%20New%20ZoomConnect%20Logo-01.png"
                            alt="ZoomConnect"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800 leading-tight">
                                {employee?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {employee?.email || ''}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center overflow-hidden transition-all flex-shrink-0"
                            title="Logout"
                        >
                            <img
                                src={`https://ui-avatars.com/api/?name=${employee?.full_name || 'User'}`}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </button>
                    </div>
                </header>

                {/* Left margin spacing - Desktop only */}
                <div className="hidden lg:block w-6"></div>

                {/* Left Sidebar - Desktop Only */}
                <aside className="hidden lg:flex flex-col items-center w-16 bg-white rounded-2xl shadow-sm py-6 my-4 relative">
                    <div className="mb-6">
                        <Link href="/employee/dashboard" className="block">
                            <div className="w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden bg-white">
                                <img
                                    src="/assets/images/Purple%20New%20ZoomConnect%20Logo-01.png"
                                    alt="ZoomConnect"
                                    className="w-12 h-12 object-contain"
                                />
                            </div>
                        </Link>
                    </div>
                    <nav className="flex-1 flex flex-col items-center gap-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.route);
                            return (
                                <div key={item.id} className="relative">
                                    <Link
                                        href={item.route}
                                        onMouseEnter={() => setHoveredIcon(item.id)}
                                        onMouseLeave={() => setHoveredIcon(null)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                            active
                                                ? 'bg-[rgb(147,71,144)] text-white shadow-md'
                                                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </Link>
                                    {/* Tooltip */}
                                    {hoveredIcon === item.id && (
                                        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-50 shadow-lg">
                                            {item.label}
                                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                    <div className="mt-auto">
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center overflow-hidden transition-all"
                            title="Logout"
                        >
                            <img
                                src={`https://ui-avatars.com/api/?name=${employee?.full_name || 'User'}`}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </button>
                    </div>
                </aside>

                {/* Spacing between left sidebar and main content - Desktop only */}
                <div className="hidden lg:block w-4"></div>

                {/* Main Content Area - Scrollable without scrollbar */}
                <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide lg:mr-6 pb-20 lg:pb-0">
                    <div className="w-full max-w-full px-4 sm:px-6 lg:px-0">
                        {children}
                    </div>
                </div>

                {/* Bottom Navigation Bar - Mobile Only */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20 safe-area-bottom">
                    <div className="flex items-center justify-around px-2 py-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.route);
                            return (
                                <Link
                                    key={item.id}
                                    href={item.route}
                                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all min-w-0 flex-1 ${
                                        active
                                            ? 'text-[rgb(147,71,144)]'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <Icon className={`w-6 h-6 mb-1 ${active ? 'text-[rgb(147,71,144)]' : ''}`} />
                                    <span className={`text-xs font-medium truncate ${
                                        active ? 'text-[rgb(147,71,144)]' : 'text-gray-600'
                                    }`}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </>
    );
}
