import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  AlertTriangle,
  ShoppingCart,
  Receipt,
  Truck,
  Plus,
  RefreshCw,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';

export const LowStockView: React.FC = () => {
  const {
    medicines,
    adjustStock,
    addPurchaseOrder,
    suppliers,
    settings,
    setActivePage,
    showToast
  } = usePharmacy();

  // Find all medicines where quantity <= minStock
  const lowStockItems = medicines.filter((m) => m.quantity <= m.minStock);

  // Group calculations
  const criticalZeroCount = lowStockItems.filter((m) => m.quantity === 0).length;
  const bufferDepletedCount = lowStockItems.filter((m) => m.quantity > 0).length;
  
  // Suggested reorder quantity = 3 * minStock - current quantity
  const estimatedReorderCost = lowStockItems.reduce((acc, m) => {
    const suggestedQty = Math.max(50, m.minStock * 3 - m.quantity);
    return acc + suggestedQty * m.purchasePrice;
  }, 0);

  const handleReorderSingleItem = (medicineId: string, name: string) => {
    const med = medicines.find((m) => m.id === medicineId);
    if (!med) return;
    const reorderQty = Math.max(50, med.minStock * 3 - med.quantity);

    adjustStock(medicineId, reorderQty, 'Automated replenishing delivery');
    showToast('Stock Replenished', `${name} restocked with ${reorderQty} units.`, 'success');
  };

  const handleCreateBatchPurchaseOrder = () => {
    if (lowStockItems.length === 0) {
      showToast('No Low Stock Items', 'All medicines have sufficient inventory levels.', 'info');
      return;
    }

    const supplierGroup = lowStockItems[0]?.supplier || suppliers[0]?.name || 'MedPlus Wholesale Logistics';
    const items = lowStockItems.map((m) => {
      const suggestedQty = Math.max(50, m.minStock * 3 - m.quantity);
      return {
        medicineName: m.name,
        quantity: suggestedQty,
        unitPrice: m.purchasePrice,
        total: suggestedQty * m.purchasePrice
      };
    });

    const totalAmount = items.reduce((sum, i) => sum + i.total, 0);

    const newPO = addPurchaseOrder({
      supplierId: suppliers[0]?.id || 'SUP-101',
      supplierName: supplierGroup,
      orderDate: new Date().toISOString().split('T')[0],
      itemsCount: items.length,
      totalAmount,
      status: 'Pending',
      items
    });

    setActivePage('purchases');
    showToast('Batch PO Raised', `Purchase order #${newPO.id} created for ${items.length} low stock medicines!`, 'success');
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Low Stock & Inventory Depletion Alerts
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Identify pharmaceutical inventory falling beneath minimum safety buffers and generate replenishment purchase orders.
          </p>
        </div>

        <button
          onClick={handleCreateBatchPurchaseOrder}
          className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Receipt className="w-4 h-4" />
          <span>Create Consolidated Purchase Order</span>
        </button>
      </div>

      {/* Warning Cards at the Top */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-xs font-semibold">Under Minimum Threshold</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-950 tabular-nums">
            {lowStockItems.length} <span className="text-xs font-normal text-amber-700">SKUs Affected</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-1">
            {criticalZeroCount} completely out of stock, {bufferDepletedCount} under safety margin
          </p>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200 p-4 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-rose-800 mb-1">
            <span className="text-xs font-semibold">Immediate Stockout Risk</span>
            <Package className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-950 tabular-nums">
            {criticalZeroCount} <span className="text-xs font-normal text-rose-700">Zero Stock</span>
          </div>
          <p className="text-[11px] text-rose-700 mt-1">
            Customers cannot be dispensed without substitution
          </p>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 p-4 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-teal-800 mb-1">
            <span className="text-xs font-semibold">Estimated Reorder Capital</span>
            <Receipt className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-teal-950 tabular-nums truncate">
            {settings.currencySymbol}{Math.round(estimatedReorderCost).toLocaleString()}
          </div>
          <p className="text-[11px] text-teal-700 mt-1">
            Calculated to replenish all SKUs to 3x safety buffers
          </p>
        </div>
      </div>

      {/* Low Stock Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Depleted Inventory Priority Queue</h3>
            <p className="text-xs text-slate-500">Sorted by highest stock deficit</p>
          </div>
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
            {lowStockItems.length} items requiring replenishment
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Medicine Name</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-right">Current Stock</th>
                <th className="py-3 px-3 text-right">Minimum Stock</th>
                <th className="py-3 px-3 text-right">Stock Deficit</th>
                <th className="py-3 px-3">Primary Supplier</th>
                <th className="py-3 px-3 text-right">Suggested Reorder</th>
                <th className="py-3 px-3 text-right">Unit Cost</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">All medicines are safely stocked</p>
                    <p className="text-xs text-slate-400">No SKUs are below their minimum threshold limits.</p>
                  </td>
                </tr>
              ) : (
                lowStockItems.map((med) => {
                  const suggestedReorder = Math.max(50, med.minStock * 3 - med.quantity);
                  const deficit = med.minStock - med.quantity;

                  return (
                    <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{med.name}</div>
                        <div className="text-[11px] text-slate-500">{med.genericName} • Batch {med.batchNo}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {med.shelfLocation}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums">
                        <span className={`font-bold ${med.quantity === 0 ? 'text-rose-600' : 'text-amber-600'}`}>
                          {med.quantity} units
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums text-slate-600">
                        {med.minStock} units
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums text-rose-600 font-semibold">
                        -{deficit > 0 ? deficit : 0} units
                      </td>
                      <td className="py-3 px-3 text-slate-700 max-w-[150px] truncate" title={med.supplier}>
                        {med.supplier}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums font-bold text-teal-700">
                        +{suggestedReorder} units
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums font-mono text-slate-700">
                        {settings.currencySymbol}{med.purchasePrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleReorderSingleItem(med.id, med.name)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors cursor-pointer"
                        >
                          Quick Restock
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
