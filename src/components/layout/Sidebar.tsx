import React from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { NavigationPage } from '../../types';
import {
  LayoutDashboard,
  Pill,
  Boxes,
  ShoppingCart,
  Receipt,
  Truck,
  Users,
  ClipboardList,
  AlertTriangle,
  ClockAlert,
  BarChart3,
  Settings,
  PlusCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    activePage,
    setActivePage,
    cart,
    dashboardStats,
    settings
  } = usePharmacy();

  const navItems: {
    id: NavigationPage;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    {
      id: 'pos',
      label: 'Sales / POS',
      icon: ShoppingCart,
      badge: cart.length > 0 ? cart.length : undefined,
      badgeColor: 'bg-emerald-500 text-white'
    },
    { id: 'purchases', label: 'Purchases', icon: Receipt },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'prescriptions', label: 'Prescriptions', icon: ClipboardList },
    {
      id: 'lowstock',
      label: 'Low Stock',
      icon: AlertTriangle,
      badge: dashboardStats.lowStockCount,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'expiry',
      label: 'Expiry Alerts',
      icon: ClockAlert,
      badge: dashboardStats.expiringSoonCount,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (id: NavigationPage) => {
    setActivePage(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
              <Pill className="w-5 h-5 rotate-45" />
            </div>
            <div className="min-w-0">
              <span className="text-base font-bold text-slate-900 tracking-tight block truncate">
                PharmAI
              </span>
              <span className="text-[11px] text-teal-600 font-medium block -mt-0.5 truncate">
                Smart Pharmacy OS
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick action button */}
        <div className="p-3">
          <button
            onClick={() => handleNavClick('pos')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Counter Sale (POS)</span>
          </button>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`shrink-0 ml-2 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums rounded-full ${
                      item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Pharmacy system status footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <div className="px-2 py-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-500 font-medium">Store License</span>
              <span className="text-emerald-700 font-semibold">Active</span>
            </div>
            <p className="text-[11px] font-mono text-slate-700 truncate">
              {settings.drugLicenseNo}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
