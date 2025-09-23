import React, { useState } from 'react';
import { useTheme } from '../../Context/ThemeContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
export default function SuperAdminLayout({ user, children }) {
  const { darkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggle sidebar open/close
  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);

  return (
    <div className={`flex h-screen max-h-screen w-full font-montserrat overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto p-2 md:p-4 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
