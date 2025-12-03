import React from 'react';
import { LayoutDashboard, Users, Truck, ShoppingCart, Sparkles, LogOut, Package, Shield, ClipboardList } from './Icons';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  user: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'inventory', label: 'Inventory', icon: <Package className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <ClipboardList className="w-5 h-5" /> },
    { id: 'clients', label: 'Clients', icon: <Users className="w-5 h-5" /> },
    { id: 'suppliers', label: 'Suppliers', icon: <Truck className="w-5 h-5" /> },
    { id: 'team', label: 'Team', icon: <Shield className="w-5 h-5" /> },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-100 z-50 transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-10 px-2">
            <span className="text-xl font-bold text-slate-900 tracking-tight">Orbit</span>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id
                  ? 'bg-slate-50 text-slate-900 font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase">
                {user?.name?.substring(0, 2) || 'JD'}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Guest'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'guest@orbit.com'}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;