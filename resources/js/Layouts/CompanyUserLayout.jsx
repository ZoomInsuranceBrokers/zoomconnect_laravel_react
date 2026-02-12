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
        { name: 'Policies', path: '/company-user/policies', active: currentPath === '/company-user/policies' },
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
            <header className="pt-6 px-8 flex items-center justify-between relative z-50">
                <Link href="/company-user/dashboard" className="flex items-center gap-3 px-2 py-0">
                    <img
                        src="/assets/logo/zoom_connect_logo.png"
                        alt="Zoom Connect"
                        className="h-12 w-auto"
                        style={{ background: 'transparent' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'inline';
                        }}
                    />
                   
                </Link>

                <nav className="hidden lg:flex items-center gap-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                                item.active 
                                    ? 'bg-[#2d2d2d] text-white shadow-lg' 
                                    : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <button className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 text-sm font-medium bg-white/20 hover:bg-white/40 rounded-full transition-all border border-gray-200/50 backdrop-blur-sm">
                        <FiSettings className="w-4 h-4" />
                        <span>Setting</span>
                    </button>
                    <button className="p-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-gray-600 border border-gray-100">
                        <FiBell className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-200">
                        <img src="https://i.pravatar.cc/100?u=Lora" alt="User" />
                    </div>
                </div>
            </header>

            <main className="px-8 pt-10 pb-20 max-w-[1600px] mx-auto">
                {children}
            </main>
        </div>
    );
}