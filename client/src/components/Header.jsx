import React from 'react';
import { Menu, Search, Bell, Shield, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const Header = ({ onOpenSidebar, pageTitle = 'Dashboard' }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {pageTitle}
          </h2>
          <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
            Municipal Solid Waste Monitoring & Digital Dispatch
          </p>
        </div>
      </div>

      {/* Right: Quick Search, Role Badge, User dropdown / actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Search Button */}
        <button
          onClick={() => navigate('/search')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick search records...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded shadow-xs text-slate-500">
            Ctrl+K
          </kbd>
        </button>

        {/* Role Pill */}
        <StatusBadge status={user?.role || 'MUNICIPAL STAFF'} className="hidden sm:inline-flex" />

        {/* Notification indicator */}
        <Link
          to="/dashboard"
          title="System Alerts"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
        </Link>

        {/* User Mini Profile */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-emerald-600/30">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{user?.department}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
