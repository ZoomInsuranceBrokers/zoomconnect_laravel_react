import React, { useState } from 'react';
import { useTheme } from '../../Context/ThemeContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
export default function SuperAdminLayout({ user, children }) {
  const { darkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`flex h-screen w-screen font-montserrat ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} onSidebarToggle={() => setSidebarOpen((open) => !open)} />
        <main className="flex-1 overflow-y-auto p-8 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
