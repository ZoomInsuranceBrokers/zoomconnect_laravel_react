import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { 
    FiSettings, FiBell, FiMenu, FiX 
} from 'react-icons/fi';

export default function CompanyUserLayout({ children, user }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const currentPath = window.location.pathname;
    
    const menuItems = [
        { name: 'Dashboard', path: '/company-user/dashboard', active: currentPath === '/company-user/dashboard' },
        { name: 'Employees', path: '/company-user/employees', active: currentPath === '/company-user/employees' },
        { name: 'Policies', path: '/company-user/policies', active: currentPath.startsWith('/company-user/policies') },
        { name: 'Enrollments', path: '/company-user/enrollments', active: currentPath === '/company-user/enrollments' },
        { name: 'Survey', path: '/company-user/survey', active: currentPath === '/company-user/survey' },
    ];

    return (
        <div className="min-h-screen relative overflow-x-hidden font-sans selection:bg-yellow-200">
            {/* Mirror/Mesh Background Effect */}
            <div className="fixed inset-0 z-[-1] bg-[#f8f6f0]">
                <div 
                    className="absolute top-[-10%] right-[-5%] w-[60%] h-[70%] rounded-full blur-[120px] opacity-60"
                    style={{ background: 'radial-gradient(circle, #fde68a 0%, #fff7ed 70%)' }}
                />
                <div 
                    className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] rounded-full blur-[100px] opacity-30"
                    style={{ background: 'radial-gradient(circle, #e5e7eb 0%, transparent 70%)' }}
                />
            </div>

            {/* Header Navigation */}
            <header className="py-4 px-4 sm:px-8 bg-white md:bg-transparent backdrop-blur-0 md:backdrop-blur-none flex items-center justify-between relative z-50">
                <Link href="/company-user/dashboard" className="flex items-center gap-3 px-2 py-0">
                    <img
                        src="/assets/logo/ZoomConnect-logo.png"
                        alt="Zoom Connect"
                        className="h-12 sm:h-18 w-40 sm:w-56 object-contain"
                        style={{ background: 'transparent' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'inline';
                        }}
                    />
                   
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                                item.active 
                                    ? 'bg-[#2d2d2d] text-white shadow-lg' 
                                    : 'text-gray-600 md:text-gray-700 hover:text-gray-900'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 text-sm font-medium bg-white/20 hover:bg-white/40 rounded-full transition-all border border-gray-200/50 backdrop-blur-sm">
                        <FiSettings className="w-4 h-4" />
                        <span>Setting</span>
                    </button>
                    <button className="p-2.5 bg-white md:bg-white/10 md:backdrop-blur-sm hover:bg-white/20 rounded-full shadow-sm md:shadow-none text-gray-600 md:text-gray-700 border border-gray-100 md:border-gray-300/30 transition-all">
                        <FiBell className="w-5 h-5" />
                    </button>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white md:border-gray-300 shadow-sm overflow-hidden bg-gray-200">
                        <img src="https://i.pravatar.cc/100?u=Lora" alt="User" />
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Sidebar Menu */}
            {sidebarOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                    
                    {/* Sidebar */}
                    <nav className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-2xl z-40 lg:hidden pt-24 px-4 overflow-y-auto transform transition-transform duration-300">
                        <div className="space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`block w-full px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                                        item.active 
                                            ? 'bg-[#2d2d2d] text-white shadow-md' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        
                        {/* Mobile Menu Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                            <button className="w-full flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all text-sm font-medium">
                                <FiSettings className="w-4 h-4" />
                                <span>Settings</span>
                            </button>
                            <div className="text-xs text-gray-500 px-6 py-2">
                                Logged in as <span className="font-semibold text-gray-900">{user?.name || 'User'}</span>
                            </div>
                        </div>
                    </nav>
                </>
            )}

            <main className="px-4 sm:px-8 pt-8 sm:pt-10 pb-20 max-w-[1600px] mx-auto">
                {children}
            </main>
        </div>
    );
}