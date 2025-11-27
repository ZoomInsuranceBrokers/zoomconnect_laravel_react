import React from 'react';
import { useTheme } from '../../Context/ThemeContext';

export default function Topbar({ user, onSidebarToggle }) {
  const { darkMode } = useTheme();
  return (
    <header
      className={`flex flex-col md:flex-row items-center md:items-center justify-between px-3 sm:px-4 md:px-8 py-3 md:py-0 h-auto md:h-20 border-b transition-colors duration-300 font-montserrat ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}
    >
      {/* Left: Welcome message (hidden on mobile, shown above profile on mobile) */}
      <div className="w-full md:w-auto flex flex-col md:block items-center md:items-start text-center md:text-left mb-2 md:mb-0">
        <div className="hidden md:block text-xl font-bold text-gray-900 dark:text-white mb-1">
          Welcome back, <span className="text-primary">{user?.user_name || 'SuperAdmin'}</span>!
        </div>
        <div className="hidden md:block text-xs text-gray-400 dark:text-gray-300">
          It is the best time to manage your finances
        </div>
        {/* Mobile welcome removed for better mobile appearance */}
      </div>

      {/* Right: Profile (always at right edge) */}
      <div className="flex items-center gap-2 sm:gap-3 pl-0 md:pl-4 border-l-0 md:border-l border-gray-200 w-full md:w-auto justify-end">
        <div className="flex flex-col items-end text-right flex-1 md:flex-none">
          <span className="font-semibold text-sm text-gray-900 dark:text-white truncate max-w-[120px] md:max-w-none">{user?.user_name || 'SuperAdmin'}</span>
          <span className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">{user?.email}</span>
        </div>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
          {user?.user_name ? user.user_name[0] : 'S'}
        </div>
      </div>
    </header>
  );
}
