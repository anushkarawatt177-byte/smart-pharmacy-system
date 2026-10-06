import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  Pill,
  Boxes,
  IndianRupee,
  ShoppingCart,
  Users,
  AlertTriangle,
  ClockAlert,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Receipt,
  FileCheck2,
  PackagePlus,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  WEEKLY_SALES_DATA,
  MONTHLY_REVENUE_DATA,
  INVENTORY_STATUS_DATA
} from '../../data/mockData';
import { Sale } from '../../types';
import { InvoiceReceiptModal } from '../pos/InvoiceReceiptModal';

export const DashboardView: React.FC = () => {
  const {
    dashboardStats,
    medicines,
    sales,
    activities,
    settings,
    setActivePage,
    adjustStock,
    showToast
  } = usePharmacy();

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Filter low stock and expiring items for dashboard cards
  const lowStockMedicines = medicines
    .filter((m) => m.quantity <= m.minStock && m.quantity > 0)
    .slice(0, 4);

  const now = new Date('2026-10-06');
  const expiringMedicines = medicines
    .filter((m) => {
      const exp = new Date(m.expiryDate);
      const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 90;
    })
    .slice(0, 4);

  // 8 Summary Cards data
  const summaryCards = [
    {
      title: 'Total Medicines',
      value: dashboardStats.totalMedicines.toLocaleString(),
      subtext: '+8 newly cataloged this month',
      icon: Pill,
      color: 'from-sky-500 to-blue-600',
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-700',
      target: 'medicines' as const
    },
    {
      title: 'Total Inventory',
      value: `${dashboardStats.totalInventory.toLocaleString()} units`,
      subtext: 'Across 6 storage racks',
      icon: Boxes,
      color: 'from-teal-500 to-emerald-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      target: 'inventory' as const
    },
    {
      title: "Today's Sales",
      value: `${settings.currencySymbol}${dashboardStats.todaySales.toLocaleString()}`,
      subtext: '+12.4% vs previous Sunday',
      icon: IndianRupee,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      target: 'pos' as const
    },
    {
      title: "Today's Orders",
      value: dashboardStats.todayOrders.toLocaleString(),
      subtext: 'Average bill ₹386',
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      target: 'reports' as const
    },
    {
      title: 'Total Customers',
      value: dashboardStats.totalCustomers.toLocaleString(),
      subtext: '84% repeat patient rate',
      icon: Users,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-700',
      target: 'customers' as const
    },
    {
      title: 'Low Stock Medicines',
      value: dashboardStats.lowStockCount.toString(),
      subtext: 'Requires purchase reorder',
      icon: AlertTriangle,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      target: 'lowstock' as const
    },
    {
      title: 'Expiring Soon',
      value: dashboardStats.expiringSoonCount.toString(),
      subtext: 'Within 90-day threshold',
      icon: ClockAlert,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700',
      target: 'expiry' as const
    },
    {
      title: 'Inventory Value',
      value: `${settings.currencySymbol}${dashboardStats.inventoryValue.toLocaleString()}`,
      subtext: 'Cost valuation basis',
      icon: TrendingUp,
      color: 'from-cyan-500 to-teal-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
      target: 'reports' as const
    }
  ];

  const handleQuickRestock = (medId: string, name: string) => {
    adjustStock(medId, 50, 'Emergency buffer restock');
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Page Title & Quick Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Pharmacy Control Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Real-time analytics, dispensing performance, and dispensary inventory health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('pos')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Open POS Counter</span>
          </button>
          <button
            onClick={() => setActivePage('medicines')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <PackagePlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Catalog Medicine</span>
          </button>
        </div>
      </div>

      {/* 8 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => setActivePage(card.target)}
              className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    {card.title}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                    {card.value}
                  </h3>
                </div>
                <div className={`p-2.5 rounded-lg ${card.bgColor} ${card.textColor} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500 truncate">{card.subtext}</span>
                <span className="text-sky-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                  View <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Sales & Profit Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Weekly Dispensing & Revenue Trend
              </h3>
              <p className="text-xs text-slate-500">
                Daily sales totals in {settings.currencySymbol} vs net estimated profit
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
              Current Week +18.2%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_SALES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [
                    `${settings.currencySymbol}${Number(val || 0).toLocaleString()}`,
                    ''
                  ]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="sales" name="Gross Sales" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#salesGrad)" />
                <Area type="monotone" dataKey="profit" name="Gross Profit" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Status Donut Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Inventory Stock Health
              </h3>
              <button
                onClick={() => setActivePage('inventory')}
                className="text-xs text-sky-600 hover:text-sky-800 font-medium"
              >
                View all
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time stock ratio across 1,248 SKUs
            </p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={INVENTORY_STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {INVENTORY_STATUS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val || 0} SKUs`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {INVENTORY_STATUS_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}</span>
                <span className="font-semibold text-slate-900 ml-auto tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables & Alerts Dual Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Sales Table (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Recent Point-of-Sale Transactions</h3>
              <p className="text-xs text-slate-500">Latest dispensed prescriptions and OTC counter receipts</p>
            </div>
            <button
              onClick={() => setActivePage('reports')}
              className="text-xs text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Sales Log</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-600 border-y border-slate-200 font-medium">
                <tr>
                  <th className="py-2.5 px-3 text-left">Invoice No.</th>
                  <th className="py-2.5 px-3 text-left">Customer</th>
                  <th className="py-2.5 px-3 text-center">Items</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Payment</th>
                  <th className="py-2.5 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.slice(0, 5).map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900">
                      {sale.id}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium truncate max-w-[140px]">
                      {sale.customerName}
                    </td>
                    <td className="py-2.5 px-3 text-center tabular-nums text-slate-600">
                      {sale.items.length} meds
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-slate-900">
                      {settings.currencySymbol}{sale.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="text-xs text-sky-600 hover:text-sky-800 font-medium cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Operational Alerts & Activities */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Live Activity Feed</h3>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>

            <div className="space-y-3">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{act.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{act.description}</p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts banner */}
          <div className="p-3 bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-100 rounded-lg">
            <h4 className="text-xs font-semibold text-sky-950">Quick Restock Action</h4>
            <p className="text-[11px] text-sky-700 mt-0.5">
              18 items currently below minimum buffer limits.
            </p>
            <button
              onClick={() => setActivePage('lowstock')}
              className="mt-2 text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Review Low Stock Reorders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Low Stock & Expiring Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Low Stock Watch */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900">Critical Low Stock Medicines</h3>
            </div>
            <button
              onClick={() => setActivePage('lowstock')}
              className="text-xs text-sky-600 hover:text-sky-800 font-medium cursor-pointer"
            >
              Manage all
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {lowStockMedicines.map((m) => (
              <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-slate-900">{m.name}</p>
                  <p className="text-[11px] text-slate-500">{m.genericName} • {m.shelfLocation}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-bold text-amber-600 tabular-nums">{m.quantity} units</span>
                    <span className="text-[10px] text-slate-400 block">Min: {m.minStock}</span>
                  </div>
                  <button
                    onClick={() => handleQuickRestock(m.id, m.name)}
                    className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Quick restock 50 units"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Soon Watch */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ClockAlert className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-semibold text-slate-900">Expiring Within 90 Days</h3>
            </div>
            <button
              onClick={() => setActivePage('expiry')}
              className="text-xs text-sky-600 hover:text-sky-800 font-medium cursor-pointer"
            >
              Manage all
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {expiringMedicines.map((m) => (
              <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-slate-900">{m.name}</p>
                  <p className="text-[11px] text-slate-500">Batch {m.batchNo} • {m.supplier}</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-rose-600 tabular-nums">{m.expiryDate}</span>
                  <span className="text-[10px] text-slate-400 block">{m.quantity} units at risk</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceReceiptModal
        sale={selectedSale}
        settings={settings}
        isOpen={Boolean(selectedSale)}
        onClose={() => setSelectedSale(null)}
      />
    </div>
  );
};
