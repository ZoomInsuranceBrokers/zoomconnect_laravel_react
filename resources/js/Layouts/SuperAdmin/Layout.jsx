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
  <div className={`relative min-h-screen w-full font-montserrat ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}> 
      {/* Fixed Sidebar */}
  <div className="fixed top-0 left-0 z-30 w-64">
        <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      </div>
      {/* Main content area with left margin for sidebar */}
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen">
        {/* Fixed Topbar */}
        <div className="fixed top-0 left-0 md:left-64 right-0 z-20">
          <Topbar user={user} />
        </div>
        {/* Main content below topbar */}
        <main className="flex-1 pt-[64px] md:pt-[80px] p-2 md:p-4 overflow-y-auto transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
