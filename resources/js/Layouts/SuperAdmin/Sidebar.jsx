import React from 'react';
import { useTheme } from '../../Context/ThemeContext';
import { Link } from '@inertiajs/react';

const menuItems = [
  { name: 'Dashboard', icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 8h2v-2H7v2zm0-4h2v-2H7v2zm0-4h2V7H7v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2z"/></svg>
  ), href: '/superadmin/dashboard' },
  { name: 'Transactions', icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/></svg>
  ), href: '/superadmin/transactions' },
  { name: 'Wallet', icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/><circle cx="16" cy="15" r="2"/></svg>
  ), href: '/superadmin/wallet' },
  { name: 'Goals', icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  ), href: '/superadmin/goals' },
  { name: 'Budget', icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
  ), href: '/superadmin/budget' },
  { name: 'Analytics', icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17v-6M15 17V7"/></svg>
  ), href: '/superadmin/analytics' },
  { name: 'Settings', icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
  ), href: '/superadmin/settings' },
];

export default function Sidebar() {
  const { darkMode, toggleDarkMode } = useTheme();
  // Default to Dashboard
  const currentActive = 'Dashboard';
  return (
    <aside className={`h-full hidden md:flex w-full md:w-64 flex-col font-montserrat border-r border-[#E6E8F5] relative transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#F5F6FF] text-black'}`}>
      {/* Logo */}
      <div className="flex items-center justify-center h-16 md:h-24 mb-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5B6FFF] to-[#A685FA] flex items-center justify-center mr-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#fff" fillOpacity=".15"/></svg>
        </div>
        <span className="text-lg font-bold tracking-wide font-montserrat"><span className="text-[#5B6FFF]">Zoom</span><span className={darkMode ? 'text-white' : 'text-[#22223B]'}>Connect</span></span>
      </div>
      {/* Menu */}
      <nav className="flex-1 pt-2 pb-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`flex items-center gap-3 px-7 py-2 font-montserrat font-medium text-[13px] transition-colors duration-200 ${currentActive === item.name ? 'mx-2 bg-[#934790] text-white shadow rounded-xl' : `hover:bg-[#6A0066] hover:text-white ${darkMode ? 'text-white' : 'text-black'} rounded-lg`}`}
              >
                <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {/* Help & Logout */}
      <div className="px-7 pb-4 mt-auto">
        <a href="#help" className={`flex items-center gap-3 py-2 font-montserrat font-normal text-[12px] ${darkMode ? 'text-gray-400 hover:text-white' : 'text-[#A0A3BD] hover:text-[#934790]'}`}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 115.82 0c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>Help</span>
        </a>
        <Link
          href="/logout"
          method="post"
          as="button"
          className={`flex items-center gap-3 py-2 font-montserrat font-normal text-[12px] w-full ${darkMode ? 'text-gray-400 hover:text-white' : 'text-[#A0A3BD] hover:text-[#934790]'}`}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><path d="M3 21V3a2 2 0 012-2h6a2 2 0 012 2v4"/></svg>
          <span>Log out</span>
        </Link>
      </div>
      {/* Dark mode toggle with sun/moon */}
      <div className="px-7 pb-6 flex items-center gap-3">
        <span className="text-xs font-medium font-montserrat">Dark Mode</span>
        <button
          onClick={toggleDarkMode}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-[#934790]' : 'bg-gray-300'}`}
        >
          <span className={`h-5 w-5 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${darkMode ? 'translate-x-6 bg-[#22223B]' : 'bg-white'}`}>
            {darkMode ? (
              <svg width="16" height="16" fill="none" stroke="#FFD700" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>
            ) : (
              <svg width="16" height="16" fill="none" stroke="#FFD700" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            )}
          </span>
        </button>
      </div>
    </aside>
  );
}
