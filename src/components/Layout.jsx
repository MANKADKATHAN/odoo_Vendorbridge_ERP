import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from './ToastContainer';

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />

      {/* Main Viewport Container */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header setIsMobileOpen={setIsMobileOpen} />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </main>
      </div>

      {/* Toast Alert Popups System */}
      <ToastContainer />
    </div>
  );
}
