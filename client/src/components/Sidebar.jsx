import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  Truck,
  Cpu,
  Recycle,
  MountainSnow,
  FileBarChart,
  Search,
  Users,
  UserCircle,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  Leaf
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Drawer / Permanent */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                MuniWaste<span className="text-emerald-600">Track</span>
              </h1>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Digital Municipal System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Main Dashboard */}
          <div>
            <NavLink to="/dashboard" onClick={onClose} className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              <span>Dashboard</span>
            </NavLink>
          </div>

          {/* Waste Management Group */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Waste Operations
            </div>
            <div className="space-y-1">
              <NavLink to="/segregation" onClick={onClose} className={navLinkClass}>
                <Layers className="w-4 h-4 flex-shrink-0" />
                <span>Waste Segregation</span>
              </NavLink>
              <NavLink to="/collection" onClick={onClose} className={navLinkClass}>
                <Truck className="w-4 h-4 flex-shrink-0" />
                <span>Waste Collection</span>
              </NavLink>
              <NavLink to="/processing" onClick={onClose} className={navLinkClass}>
                <Cpu className="w-4 h-4 flex-shrink-0" />
                <span>Waste Processing</span>
              </NavLink>
            </div>
          </div>

          {/* Processing & Disposal */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Recovery & Landfill
            </div>
            <div className="space-y-1">
              <NavLink to="/recycling" onClick={onClose} className={navLinkClass}>
                <Recycle className="w-4 h-4 flex-shrink-0" />
                <span>Recycling Plants</span>
              </NavLink>
              <NavLink to="/landfills" onClick={onClose} className={navLinkClass}>
                <MountainSnow className="w-4 h-4 flex-shrink-0" />
                <span>Landfill Sites</span>
              </NavLink>
            </div>
          </div>

          {/* Intelligence & Analytics */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Intelligence
            </div>
            <div className="space-y-1">
              <NavLink to="/reports" onClick={onClose} className={navLinkClass}>
                <FileBarChart className="w-4 h-4 flex-shrink-0" />
                <span>Reports & Analytics</span>
              </NavLink>
              <NavLink to="/search" onClick={onClose} className={navLinkClass}>
                <Search className="w-4 h-4 flex-shrink-0" />
                <span>Search Records</span>
              </NavLink>
            </div>
          </div>

          {/* Administration (Admin only) */}
          {isAdmin && (
            <div>
              <div className="px-3 mb-2 text-[11px] font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Administration</span>
              </div>
              <div className="space-y-1">
                <NavLink to="/users" onClick={onClose} className={navLinkClass}>
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>User Management</span>
                </NavLink>
              </div>
            </div>
          )}

          {/* User Settings */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Account
            </div>
            <div className="space-y-1">
              <NavLink to="/profile" onClick={onClose} className={navLinkClass}>
                <UserCircle className="w-4 h-4 flex-shrink-0" />
                <span>My Profile</span>
              </NavLink>
              <NavLink to="/settings" onClick={onClose} className={navLinkClass}>
                <Settings className="w-4 h-4 flex-shrink-0" />
                <span>System Settings</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Footer User Badge & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-xs border border-emerald-200">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {user?.name || 'Municipal User'}
                </p>
                <p className="text-[10px] font-medium text-emerald-600 truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
