import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Medicine } from '../../types';
import {
  ClockAlert,
  AlertOctagon,
  AlertTriangle,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Layers,
  ShieldAlert
} from 'lucide-react';

export const ExpiryAlertsView: React.FC = () => {
  const {
    medicines,
    adjustStock,
    settings,
    showToast
  } = usePharmacy();

  const [activeTab, setActiveTab] = useState<'all' | 'expired' | '30days' | '60days' | '90days'>('all');

  const now = new Date('2026-10-06');

  // Categorize medicines
  const analyzedMedicines = medicines.map((m) => {
    const exp = new Date(m.expiryDate);
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    let tier: 'expired' | '30days' | '60days' | '90days' | 'safe';

    if (diffDays <= 0) tier = 'expired';
    else if (diffDays <= 30) tier = '30days';
    else if (diffDays <= 60) tier = '60days';
    else if (diffDays <= 90) tier = '90days';
    else tier = 'safe';

    return {
      medicine: m,
      diffDays,
      tier,
      inventoryValueAtRisk: m.quantity * m.purchasePrice
    };
  });

  const expiredList = analyzedMedicines.filter((x) => x.tier === 'expired');
  const within30List = analyzedMedicines.filter((x) => x.tier === '30days');
  const within60List = analyzedMedicines.filter((x) => x.tier === '60days');
  const within90List = analyzedMedicines.filter((x) => x.tier === '90days');

  // Total at risk calculation (excluding safe)
  const totalAtRiskVal = [...expiredList, ...within30List, ...within60List, ...within90List].reduce(
    (acc, x) => acc + x.inventoryValueAtRisk,
    0
  );

  const displayList = analyzedMedicines.filter((x) => {
    if (activeTab === 'all') return x.tier !== 'safe';
    return x.tier === activeTab;
  });

  const handleMarkDisposed = (medId: string, name: string, quantity: number) => {
    adjustStock(medId, -quantity, 'Biohazard expired medicine disposal protocol');
    showToast('Batch Disposed', `${name} (${quantity} units) marked for biomedical quarantine.`, 'info');
  };

  const handleReturnToVendor = (medId: string, name: string, supplier: string) => {
    showToast('Vendor Return Initiated', `Return credit note requested from ${supplier} for ${name}.`, 'success');
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Batch Expiry Management & Risk Alerts
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Monitor upcoming shelf expiration deadlines to prevent dispensing compromises and recover supplier credit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-800 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Valuation at Expiry Risk: {settings.currencySymbol}{Math.round(totalAtRiskVal).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 4 Expiry Tier Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Expired Card */}
        <div
          onClick={() => setActiveTab('expired')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'expired'
              ? 'bg-red-50 border-red-300 ring-2 ring-red-400'
              : 'bg-white border-red-200/80 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between text-red-700 mb-1">
            <span className="text-xs font-semibold">Already Expired</span>
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-red-900 tabular-nums">
            {expiredList.length} <span className="text-xs font-normal text-red-600">Batches</span>
          </div>
          <p className="text-[11px] text-red-700 mt-1 font-medium">Must quarantine & discard</p>
        </div>

        {/* Expiring within 30 days */}
        <div
          onClick={() => setActiveTab('30days')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === '30days'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400'
              : 'bg-white border-rose-200/80 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-semibold">&le; 30 Days Left</span>
            <ClockAlert className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-rose-900 tabular-nums">
            {within30List.length} <span className="text-xs font-normal text-rose-600">Batches</span>
          </div>
          <p className="text-[11px] text-rose-700 mt-1 font-medium">Urgent vendor return window</p>
        </div>

        {/* Expiring within 60 days */}
        <div
          onClick={() => setActiveTab('60days')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === '60days'
              ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-400'
              : 'bg-white border-orange-200/80 hover:border-orange-300'
          }`}
        >
          <div className="flex items-center justify-between text-orange-700 mb-1">
            <span className="text-xs font-semibold">&le; 60 Days Left</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-orange-900 tabular-nums">
            {within60List.length} <span className="text-xs font-normal text-orange-600">Batches</span>
          </div>
          <p className="text-[11px] text-orange-700 mt-1 font-medium">Prioritize first-out dispensing</p>
        </div>

        {/* Expiring within 90 days */}
        <div
          onClick={() => setActiveTab('90days')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === '90days'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400'
              : 'bg-white border-amber-200/80 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-semibold">&le; 90 Days Watch</span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-amber-900 tabular-nums">
            {within90List.length} <span className="text-xs font-normal text-amber-600">Batches</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-1 font-medium">Early warning watchlist</p>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Critical Batches ({displayList.length})
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'expired' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Expired ({expiredList.length})
          </button>
          <button
            onClick={() => setActiveTab('30days')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === '30days' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            &le; 30 Days ({within30List.length})
          </button>
          <button
            onClick={() => setActiveTab('60days')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === '60days' ? 'bg-orange-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            &le; 60 Days ({within60List.length})
          </button>
          <button
            onClick={() => setActiveTab('90days')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === '90days' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            &le; 90 Days ({within90List.length})
          </button>
        </div>
      </div>

      {/* Expiry Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Medicine & Generic</th>
                <th className="py-3 px-3">Batch Number</th>
                <th className="py-3 px-3">Rack</th>
                <th className="py-3 px-3 text-right">Units on Hand</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3 text-center">Remaining Days</th>
                <th className="py-3 px-3 text-right">Capital at Risk</th>
                <th className="py-3 px-3">Supplier</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {displayList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No batches match this filter</p>
                    <p className="text-xs text-slate-400">All other shelf batches have ample shelf life remaining.</p>
                  </td>
                </tr>
              ) : (
                displayList.map(({ medicine: med, diffDays, tier, inventoryValueAtRisk }) => (
                  <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{med.name}</div>
                      <div className="text-[11px] text-slate-500">{med.genericName}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {med.batchNo}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {med.shelfLocation}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">
                      {med.quantity}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-700">
                      {med.expiryDate}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          tier === 'expired'
                            ? 'bg-red-100 text-red-800'
                            : tier === '30days'
                            ? 'bg-rose-100 text-rose-800'
                            : tier === '60days'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {diffDays <= 0 ? 'EXPIRED' : `${diffDays} days left`}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">
                      {settings.currencySymbol}{Math.round(inventoryValueAtRisk).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-600 truncate max-w-[140px]" title={med.supplier}>
                      {med.supplier}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {tier === 'expired' ? (
                          <button
                            onClick={() => handleMarkDisposed(med.id, med.name, med.quantity)}
                            className="px-2.5 py-1 text-xs font-semibold rounded bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
                          >
                            Mark Disposed
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReturnToVendor(med.id, med.name, med.supplier)}
                            className="px-2.5 py-1 text-xs font-semibold rounded border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                          >
                            Return to Vendor
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
