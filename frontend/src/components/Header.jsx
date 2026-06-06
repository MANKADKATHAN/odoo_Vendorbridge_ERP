import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Search, Check, ShieldAlert, CheckCircle2, Info, LogOut } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function Header({ setIsMobileOpen, currentUser, onLogout }) {
  const { notifications, markAllNotificationsRead } = useDashboard();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case 'warning':
        return <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-sky-500 shrink-0" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0">
      {/* Left side: Hamburger (Mobile) & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Enterprise ERP</span>
            <span>/</span>
            <span className="text-slate-600 font-semibold">Procurement</span>
          </div>
          <h1 className="text-lg font-heading font-bold text-slate-800 m-0 leading-tight">Dashboard Overview</h1>
        </div>
      </div>

      {/* Center: Search bar */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search transactions, POs, vendors, or RFQs..."
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right side: Actions & User */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all-custom
              ${isNotifOpen ? 'bg-indigo-50/50 border-indigo-200 text-indigo-600 ring-4 ring-indigo-500/5' : ''}
            `}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-4 w-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-slide-in">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-800">Notifications ({unreadCount} new)</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <Check className="h-3 w-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 scrollbar-none">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex gap-3 p-3.5 hover:bg-slate-50/70 transition-colors ${
                        notif.unread ? 'bg-indigo-50/20' : ''
                      }`}
                    >
                      <div className="mt-0.5">{getNotifIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs text-slate-700 leading-normal ${notif.unread ? 'font-medium' : ''}`}>
                          {notif.text}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile info & logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 text-left">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 leading-tight">
              {currentUser?.name || 'Admin Demo'}
            </p>
            <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
              {currentUser?.role || 'Procurement Lead'}
            </p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-indigo-50/60 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold font-heading select-none">
            {currentUser?.name?.split(' ').map(n => n.charAt(0)).join('') || 'AD'}
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50/50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
