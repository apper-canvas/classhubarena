import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DesktopSidebar from "@/components/organisms/DesktopSidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:h-screen">
        {/* Desktop Sidebar */}
        <div className="w-64 flex-shrink-0">
          <DesktopSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMobileMenuToggle={toggleMobileMenu} />
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <Header onMobileMenuToggle={toggleMobileMenu} />
        <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;