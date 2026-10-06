import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  Calendar,
  IndianRupee,
  ShoppingBag,
  ArrowUpRight,
  PieChart as PieIcon,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  MONTHLY_REVENUE_DATA,
  WEEKLY_SALES_DATA,
  CATEGORY_SALES_DISTRIBUTION,
  TOP_SELLING_MEDICINES
} from '../../data/mockData';

export const ReportsView: React.FC = () => {
  const { settings, sales, showToast } = usePharmacy();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // KPI Metrics calculations
  const dailyAvgSales = 46800;
  const weeklySalesTotal = 330750;
  const monthlyRevenueTotal = 1310000;
  const purchaseExpensesTotal = 890000;
  const estimatedProfitTotal = monthlyRevenueTotal - purchaseExpensesTotal;
  const profitMarginPercent = ((estimatedProfitTotal / monthlyRevenueTotal) * 100).toFixed(1);

  const handleExportCsv = () => {
    // Generate CSV data string
    const csvRows = [
      ['Metric', 'Amount (INR)', 'Period'],
      ['Daily Sales Average', dailyAvgSales, 'October 2026'],
      ['Weekly Sales Total', weeklySalesTotal, 'Current Week'],
      ['Monthly Projected Revenue', monthlyRevenueTotal, 'October 2026'],
      ['Procurement Expenses', purchaseExpensesTotal, 'October 2026'],
      ['Estimated Net Profit', estimatedProfitTotal, 'October 2026'],
      ['Net Profit Margin (%)', `${profitMarginPercent}%`, 'October 2026']
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Pharmacy_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report Exported', 'CSV summary downloaded to your device.', 'success');
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Financial Analytics & Executive Reports
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Audit pharmacy turnover, gross margin performance, drug category share, and top-moving products.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium block">Daily Sales (Avg)</span>
          <span className="text-lg font-bold text-slate-900 mt-0.5 block tabular-nums">
            {settings.currencySymbol}{dailyAvgSales.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">+8.4% vs last mo</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium block">Weekly Sales</span>
          <span className="text-lg font-bold text-slate-900 mt-0.5 block tabular-nums">
            {settings.currencySymbol}{weeklySalesTotal.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">1,026 invoices</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium block">Monthly Turnover</span>
          <span className="text-lg font-bold text-slate-900 mt-0.5 block tabular-nums">
            {settings.currencySymbol}{(monthlyRevenueTotal / 100000).toFixed(2)}L
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">+14.2% YoY</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium block">Purchase Expenses</span>
          <span className="text-lg font-bold text-rose-700 mt-0.5 block tabular-nums">
            {settings.currencySymbol}{(purchaseExpensesTotal / 100000).toFixed(2)}L
          </span>
          <span className="text-[10px] text-slate-400">Inventory inwards</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-teal-200 bg-teal-50/20 shadow-2xs">
          <span className="text-[11px] text-teal-700 font-medium block">Estimated Profit</span>
          <span className="text-lg font-bold text-teal-800 mt-0.5 block tabular-nums">
            {settings.currencySymbol}{(estimatedProfitTotal / 100000).toFixed(2)}L
          </span>
          <span className="text-[10px] text-teal-700 font-semibold">Net operational</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-sky-200 bg-sky-50/20 shadow-2xs">
          <span className="text-[11px] text-sky-700 font-medium block">Gross Profit Margin</span>
          <span className="text-lg font-bold text-sky-800 mt-0.5 block tabular-nums">
            {profitMarginPercent}%
          </span>
          <span className="text-[10px] text-sky-700 font-semibold">Healthy dispensary</span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue vs Purchases Comparison */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Monthly Revenue vs Procurement Costs</h3>
              <p className="text-xs text-slate-500">Evaluating 6-month gross cashflow and pharmacy margin</p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
              2026 Fiscal Year
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_REVENUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 100000}L`} />
                <Tooltip
                  formatter={(val: any) => [
                    `${settings.currencySymbol}${Number(val || 0).toLocaleString()}`,
                    ''
                  ]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="revenue" name="Sales Revenue" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="purchases" name="Supplier Purchases" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Net Gross Profit" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Sales Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Sales Volume by Drug Category</h3>
            <p className="text-xs text-slate-500 mb-2">Prescription & OTC proportion share</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_SALES_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_SALES_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val || 0}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {CATEGORY_SALES_DISTRIBUTION.map((c, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.fill }} />
                  <span className="text-slate-700">{c.name}</span>
                </div>
                <span className="font-semibold text-slate-900 tabular-nums">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Moving Medicines Leaderboard Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Top Selling Pharmaceutical Products</h3>
            <p className="text-xs text-slate-500">Highest volume dispenses in the current period</p>
          </div>
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded">
            Fastest Moving SKUs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-3">Brand Name</th>
                <th className="py-3 px-3">Generic Salt Formula</th>
                <th className="py-3 px-3 text-right">Units Dispensed</th>
                <th className="py-3 px-3 text-right">Revenue Generated</th>
                <th className="py-3 px-4 text-center">Growth Velocity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {TOP_SELLING_MEDICINES.map((item) => (
                <tr key={item.rank} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="w-6 h-6 rounded-full bg-slate-100 font-bold text-slate-800 inline-flex items-center justify-center text-xs">
                      #{item.rank}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {item.generic}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-800">
                    {item.unitsSold.toLocaleString()} units
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums font-bold text-emerald-700">
                    {settings.currencySymbol}{item.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      <ArrowUpRight className="w-3 h-3" /> {item.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
