import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Medicine } from '../../types';
import {
  Boxes,
  AlertTriangle,
  XCircle,
  ClockAlert,
  IndianRupee,
  Plus,
  Minus,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpDown,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    medicines,
    adjustStock,
    settings,
    setActivePage,
    searchQuery: globalSearchQuery
  } = usePharmacy();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expiring Soon'>('All');
  const [selectedShelf, setSelectedShelf] = useState<string>('All');
  
  // Quick Stock Adjustment modal
  const [adjustingMedicine, setAdjustingMedicine] = useState<Medicine | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
  const [adjustReason, setAdjustReason] = useState<string>('Manual stock count reconcile');

  const now = new Date('2026-10-06');

  // Compute stats
  const totalStockUnits = medicines.reduce((acc, m) => acc + m.quantity, 0);
  const lowStockCount = medicines.filter((m) => m.quantity <= m.minStock && m.quantity > 0).length;
  const outOfStockCount = medicines.filter((m) => m.quantity === 0).length;
  const expiringSoonCount = medicines.filter((m) => {
    const exp = new Date(m.expiryDate);
    const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff <= 90 && diff > 0;
  }).length;
  const totalInventoryVal = medicines.reduce((acc, m) => acc + m.quantity * m.purchasePrice, 0);

  // Get distinct shelves
  const shelves = Array.from(new Set(medicines.map((m) => m.shelfLocation.split('-')[0]))).sort();

  const activeSearch = search || globalSearchQuery;

  // Filtered rows
  const filteredList = medicines.filter((med) => {
    const matchesSearch =
      !activeSearch ||
      med.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      med.batchNo.toLowerCase().includes(activeSearch.toLowerCase()) ||
      med.genericName.toLowerCase().includes(activeSearch.toLowerCase());

    const diffDays = Math.ceil((new Date(med.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let matchesStatus = true;
    if (statusFilter === 'In Stock') matchesStatus = med.quantity > med.minStock;
    else if (statusFilter === 'Low Stock') matchesStatus = med.quantity <= med.minStock && med.quantity > 0;
    else if (statusFilter === 'Out of Stock') matchesStatus = med.quantity === 0;
    else if (statusFilter === 'Expiring Soon') matchesStatus = diffDays <= 90 && diffDays > 0;

    const matchesShelf = selectedShelf === 'All' || med.shelfLocation.startsWith(selectedShelf);

    return matchesSearch && matchesStatus && matchesShelf;
  });

  const getStatusBadge = (med: Medicine) => {
    const diffDays = Math.ceil((new Date(med.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (med.quantity === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
          <XCircle className="w-3.5 h-3.5" /> Out of Stock
        </span>
      );
    }
    if (med.quantity <= med.minStock) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
          <AlertTriangle className="w-3.5 h-3.5" /> Low Stock
        </span>
      );
    }
    if (diffDays <= 90 && diffDays > 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
          <ClockAlert className="w-3.5 h-3.5" /> Expiring Soon
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
        <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
      </span>
    );
  };

  const handleStockAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingMedicine) return;

    const delta = adjustType === 'add' ? adjustAmount : -adjustAmount;
    adjustStock(adjustingMedicine.id, delta, adjustReason);
    setAdjustingMedicine(null);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Inventory & Stock Warehouse Management
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Monitor real-time physical store holdings, batch audits, valuation, and shelf locations.
          </p>
        </div>

        <button
          onClick={() => setActivePage('purchases')}
          className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Boxes className="w-4 h-4" />
          <span>New Stock Inward PO</span>
        </button>
      </div>

      {/* 5 Inventory Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total Stock</span>
            <Boxes className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">
            {totalStockUnits.toLocaleString()} <span className="text-xs font-normal text-slate-400">units</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Across all store racks</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-yellow-200 bg-yellow-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-yellow-700 mb-1">
            <span className="text-xs font-medium">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-xl font-bold text-yellow-900 tabular-nums">
            {lowStockCount} <span className="text-xs font-normal text-yellow-600">SKUs</span>
          </div>
          <div className="text-[11px] text-yellow-700 mt-1 font-medium">Under minimum buffer</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-red-700 mb-1">
            <span className="text-xs font-medium">Out of Stock</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-xl font-bold text-red-900 tabular-nums">
            {outOfStockCount} <span className="text-xs font-normal text-red-600">SKUs</span>
          </div>
          <div className="text-[11px] text-red-700 mt-1 font-medium">Requires immediate order</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-orange-200 bg-orange-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-orange-700 mb-1">
            <span className="text-xs font-medium">Expiring Soon</span>
            <ClockAlert className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-xl font-bold text-orange-900 tabular-nums">
            {expiringSoonCount} <span className="text-xs font-normal text-orange-600">SKUs</span>
          </div>
          <div className="text-[11px] text-orange-700 mt-1 font-medium">Within 90 days window</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Inventory Value</span>
            <IndianRupee className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums truncate">
            {settings.currencySymbol}{Math.round(totalInventoryVal).toLocaleString()}
          </div>
          <div className="text-[11px] text-teal-600 mt-1 font-medium">At purchase valuation</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicine, batch, or formula..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 shrink-0 font-medium">Stock Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock (Green)</option>
              <option value="Low Stock">Low Stock (Yellow)</option>
              <option value="Out of Stock">Out of Stock (Red)</option>
              <option value="Expiring Soon">Expiring Soon (Orange)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 shrink-0 font-medium">Warehouse Rack:</span>
            <select
              value={selectedShelf}
              onChange={(e) => setSelectedShelf(e.target.value)}
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="All">All Racks</option>
              {shelves.map((sh) => (
                <option key={sh} value={sh}>
                  {sh} Storage Section
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Showing <strong className="text-slate-800">{filteredList.length}</strong> items in inventory ledger</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> In Stock</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Low Stock</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Out of Stock</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /> Expiring Soon</span>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Medicine</th>
                <th className="py-3 px-3">Batch</th>
                <th className="py-3 px-3">Rack Location</th>
                <th className="py-3 px-3 text-right">Quantity</th>
                <th className="py-3 px-3 text-right">Minimum Stock</th>
                <th className="py-3 px-3 text-right">Purchase Price</th>
                <th className="py-3 px-3 text-right">Selling Price</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredList.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{med.name}</div>
                    <div className="text-[11px] text-slate-500">{med.genericName}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                    {med.batchNo}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    {med.shelfLocation}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums">
                    <span className={`text-sm font-bold ${med.quantity === 0 ? 'text-red-600' : med.quantity <= med.minStock ? 'text-yellow-700' : 'text-slate-900'}`}>
                      {med.quantity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums text-slate-500">
                    {med.minStock} units
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums text-slate-600">
                    {settings.currencySymbol}{med.purchasePrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums font-semibold text-slate-900">
                    {settings.currencySymbol}{med.sellingPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                    {med.expiryDate}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {getStatusBadge(med)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setAdjustingMedicine(med);
                        setAdjustAmount(10);
                        setAdjustType('add');
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                    >
                      Audit / Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustingMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400">Stock Count Audit</span>
                <h3 className="text-base font-bold text-slate-900">{adjustingMedicine.name}</h3>
                <p className="text-xs text-slate-500">Batch {adjustingMedicine.batchNo} • Current: {adjustingMedicine.quantity} units</p>
              </div>
              <button
                onClick={() => setAdjustingMedicine(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStockAdjustmentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1.5">Adjustment Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      adjustType === 'add'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Inward / Restock (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('deduct')}
                    className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      adjustType === 'deduct'
                        ? 'bg-rose-50 border-rose-500 text-rose-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                    <span>Damaged / Discard (-)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Quantity of Units</label>
                <input
                  type="number"
                  min="1"
                  max={adjustType === 'deduct' ? adjustingMedicine.quantity : 1000}
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  New stock count will be:{' '}
                  <strong className="text-slate-800">
                    {adjustType === 'add'
                      ? adjustingMedicine.quantity + adjustAmount
                      : Math.max(0, adjustingMedicine.quantity - adjustAmount)}{' '}
                    units
                  </strong>
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Reason for Adjustment</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  <option value="Physical stock count reconciliation">Physical stock count reconciliation</option>
                  <option value="Damaged ampoule / broken blister pack">Damaged ampoule / broken blister pack</option>
                  <option value="Direct supplier replacement unit">Direct supplier replacement unit</option>
                  <option value="Expired batch safe quarantine">Expired batch safe quarantine</option>
                  <option value="Prescription compounding use">Prescription compounding use</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustingMedicine(null)}
                  className="px-4 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
