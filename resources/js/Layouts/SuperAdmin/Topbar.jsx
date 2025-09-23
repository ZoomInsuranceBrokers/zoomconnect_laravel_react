import React from 'react';
import { useTheme } from '../../Context/ThemeContext';

export default function Topbar({ user, onSidebarToggle }) {
  const { darkMode } = useTheme();
  return (
    <header className={`flex items-center justify-between px-4 md:px-8 h-16 md:h-20 border-b transition-colors duration-300 font-montserrat ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={onSidebarToggle}
        aria-label="Toggle sidebar"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      {/* Left: Welcome message */}
      <div className="hidden md:block">
        <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">Welcome back, <span className="text-primary">{user?.user_name || 'SuperAdmin'}</span>!</div>
        <div className="text-xs text-gray-400 dark:text-gray-300">It is the best time to manage your finances</div>
      </div>

      {/* Right: Profile */}
      <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
        <div className="hidden md:flex flex-col items-end">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">{user?.user_name || 'SuperAdmin'}</span>
          <span className="text-xs text-gray-500">{user?.email}</span>
        </div>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
          {user?.user_name ? user.user_name[0] : 'S'}
        </div>
      </div>
    </header>
  );
}
