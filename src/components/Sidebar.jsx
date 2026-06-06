import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  FileSpreadsheet, 
  Activity, 
  History,
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const { stats } = useDashboard();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', badge: null },
    { name: 'Vendors & Partners', icon: Users, path: '/vendors', badge: null },
    { name: 'Quotation Evaluation', icon: FileText, path: '/quotation-comparison', badge: stats.activeRfqs },
    { name: 'Approval Inbox', icon: ShieldCheck, path: '/approval-workflow', badge: stats.pendingApprovals > 0 ? stats.pendingApprovals : null },
    { name: 'PO & Invoice Ledger', icon: FileSpreadsheet, path: '/po-invoice', badge: null },
    { name: 'Reports & Analytics', icon: Activity, path: '/reports-analytics', badge: null },
    { name: 'System Audit Trails', icon: History, path: '/activity-logs', badge: null },
  ];

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 ease-in-out lg:static
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white shrink-0 shadow-md shadow-indigo-600/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <span className="font-heading text-lg font-bold text-white tracking-wide whitespace-nowrap animate-slide-in">
                Vendor<span className="text-indigo-400">Bridge</span>
              </span>
            )}
          </div>
          
          {/* Collapse toggle (Desktop only) */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center h-8 w-8 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-left
                  ${isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-500 pl-2' 
                    : 'hover:bg-slate-800/60 hover:text-slate-100 border-l-4 border-transparent'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    
                    {/* Text Labels - Animated fade */}
                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.name}</span>
                    )}

                    {/* Badge Counts */}
                    {item.badge !== null && (
                      <span className={`flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold shrink-0
                        ${isCollapsed ? 'absolute top-1.5 right-1.5 min-w-[16px] h-4 text-[10px] p-0' : ''}
                        ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}
                      `}>
                        {item.badge}
                      </span>
                    )}

                    {/* Desktop Collapsed Tooltip */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap shadow-xl z-50">
                        {item.name}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold shrink-0 border border-slate-700">
              AD
            </div>
            {!isCollapsed && (
              <div className="truncate flex-1 text-left">
                <p className="text-xs font-semibold text-white leading-tight">Admin Demo</p>
                <p className="text-[10px] text-slate-500 truncate leading-tight">procure@vendorbridge.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
