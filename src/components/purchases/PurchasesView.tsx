import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { PurchaseOrder } from '../../types';
import {
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Building,
  Package,
  Calendar,
  IndianRupee,
  X,
  FileText
} from 'lucide-react';

export const PurchasesView: React.FC = () => {
  const {
    purchases,
    addPurchaseOrder,
    updatePurchaseStatus,
    suppliers,
    medicines,
    settings,
    searchQuery: globalSearchQuery
  } = usePharmacy();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Received' | 'Cancelled'>('All');

  // Modals
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<PurchaseOrder | null>(null);

  // New PO form state
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [orderItems, setOrderItems] = useState<{ medicineName: string; quantity: number; unitPrice: number }[]>([
    { medicineName: medicines[0]?.name || 'Dolo 650', quantity: 100, unitPrice: medicines[0]?.purchasePrice || 22.50 }
  ]);

  const activeSearch = searchTerm || globalSearchQuery;

  const filteredPurchases = purchases.filter((po) => {
    const matchSearch =
      !activeSearch ||
      po.id.toLowerCase().includes(activeSearch.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(activeSearch.toLowerCase());

    const matchStatus = statusFilter === 'All' || po.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'Received':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Received
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
    }
  };

  const handleAddRow = () => {
    setOrderItems([...orderItems, { medicineName: medicines[0]?.name || '', quantity: 50, unitPrice: 50 }]);
  };

  const handleRemoveRow = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const handleCreatePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];

    const computedItems = orderItems.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));
    const totalAmount = computedItems.reduce((acc, i) => acc + i.total, 0);

    addPurchaseOrder({
      supplierId: sup.id,
      supplierName: sup.name,
      orderDate: new Date().toISOString().split('T')[0],
      itemsCount: computedItems.length,
      totalAmount,
      status: 'Pending',
      items: computedItems
    });

    setIsNewOrderModalOpen(false);
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Purchase Orders & Procurement
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Procure medicines from pharmaceutical distributors and track shipments.
          </p>
        </div>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase Order</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by PO number or supplier name..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
            {(['All', 'Pending', 'Received', 'Cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  statusFilter === st ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Purchase ID</th>
                <th className="py-3 px-3">Supplier Name</th>
                <th className="py-3 px-3">Order Date</th>
                <th className="py-3 px-3 text-center">Medicines</th>
                <th className="py-3 px-3 text-right">Total Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPurchases.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                    {po.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{po.supplierName}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                    {po.orderDate}
                  </td>
                  <td className="py-3 px-3 text-center tabular-nums text-slate-700">
                    {po.itemsCount} lines
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">
                    {settings.currencySymbol}{po.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {getStatusBadge(po.status)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingOrder(po)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                      >
                        View Order
                      </button>
                      {po.status === 'Pending' && (
                        <button
                          onClick={() => updatePurchaseStatus(po.id, 'Received')}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                        >
                          Mark Received
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono text-slate-400">Purchase Order</span>
                <h3 className="text-base font-bold text-slate-900">{viewingOrder.id}</h3>
                <p className="text-xs text-slate-600">{viewingOrder.supplierName}</p>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span>Date: {viewingOrder.orderDate}</span>
                <span>Status: {getStatusBadge(viewingOrder.status)}</span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3 text-left">Medicine</th>
                      <th className="py-2 px-2 text-right">Qty</th>
                      <th className="py-2 px-2 text-right">Rate</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-medium text-slate-800">{it.medicineName}</td>
                        <td className="py-2 px-2 text-right tabular-nums">{it.quantity}</td>
                        <td className="py-2 px-2 text-right tabular-nums">{settings.currencySymbol}{it.unitPrice.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right tabular-nums font-semibold">{settings.currencySymbol}{it.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-2 font-bold text-sm text-slate-900">
                <span>Total PO Valuation:</span>
                <span className="text-teal-700 font-mono">{settings.currencySymbol}{viewingOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Purchase Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-semibold text-slate-900">Raise New Purchase Order</h3>
              </div>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePurchaseSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Select Supplier *</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.company})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-700 font-medium">Order Items & Quantities</label>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={item.medicineName}
                        onChange={(e) => {
                          const updated = [...orderItems];
                          const selected = medicines.find((m) => m.name === e.target.value);
                          updated[idx].medicineName = e.target.value;
                          if (selected) updated[idx].unitPrice = selected.purchasePrice;
                          setOrderItems(updated);
                        }}
                        className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        {medicines.map((m) => (
                          <option key={m.id} value={m.name}>
                            {m.name} ({m.genericName})
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => {
                          const updated = [...orderItems];
                          updated[idx].quantity = parseInt(e.target.value) || 1;
                          setOrderItems(updated);
                        }}
                        className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-center"
                      />

                      <input
                        type="number"
                        step="0.01"
                        placeholder="Rate"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const updated = [...orderItems];
                          updated[idx].unitPrice = parseFloat(e.target.value) || 0;
                          setOrderItems(updated);
                        }}
                        className="w-24 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-right"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveRow(idx)}
                        disabled={orderItems.length === 1}
                        className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-40"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg cursor-pointer"
                >
                  Confirm & Raise Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
