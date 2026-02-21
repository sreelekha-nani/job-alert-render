
     import React, { useState } from 'react';
     import { Outlet } from 'react-router-dom';
     import Navbar from './Navbar';
     import Sidebar, { DesktopSidebar } from './Sidebar';
     
     const AppLayout: React.FC = () => {
       const [isSidebarOpen, setSidebarOpen] = useState(false);
     
     const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
      };
   
      return (
        <div className="flex h-screen bg-background">
          <DesktopSidebar />
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
   
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar toggleSidebar={toggleSidebar} />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                {/* Child routes will be rendered here */}
                <Outlet />
            </main>
          </div>
        </div>
      );
    };
   
    export default AppLayout;