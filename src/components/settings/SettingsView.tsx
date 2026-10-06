import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  Settings,
  Building,
  Save,
  Bell,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  RotateCcw
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, showToast } = usePharmacy();

  const [form, setForm] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Pharmacy Operational Settings
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-0.5">
          Configure business credentials, drug licensing, taxation rates, inventory safety thresholds, and alerts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pharmacy Profile & Regulatory Identifiers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Building className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pharmacy Profile & Licenses</h3>
              <p className="text-xs text-slate-500">Legal business details printed on customer invoices</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Pharmacy Business Name</label>
              <input
                type="text"
                required
                value={form.pharmacyName}
                onChange={(e) => setForm({ ...form, pharmacyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Tagline / Subheading</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Drug License Number (DL-20B / 21B)</label>
              <input
                type="text"
                required
                value={form.drugLicenseNo}
                onChange={(e) => setForm({ ...form, drugLicenseNo: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">GSTIN Number</label>
              <input
                type="text"
                required
                value={form.gstin}
                onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-medium mb-1">Dispensary Street Address</label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Official Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Financial & Inventory Rules */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Sliders className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Taxation & Stock Parameters</h3>
              <p className="text-xs text-slate-500">Configure default formulas and alert triggers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Default GST Tax Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="28"
                required
                value={form.taxPercentage}
                onChange={(e) => setForm({ ...form, taxPercentage: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Standard pharmaceutical GST is 12%</span>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Currency Symbol</label>
              <input
                type="text"
                disabled
                value={`${form.currencySymbol} (${form.currencyCode})`}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-mono text-xs text-slate-500 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Fixed to Indian Rupee (INR)</span>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Default Low Stock Threshold (Units)</label>
              <input
                type="number"
                min="5"
                max="100"
                required
                value={form.lowStockThreshold}
                onChange={(e) => setForm({ ...form, lowStockThreshold: parseInt(e.target.value) || 20 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Triggers low stock badge on dashboard</span>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Expiry Watchlist Window (Days)</label>
              <input
                type="number"
                min="30"
                max="180"
                required
                value={form.expiryAlertDays}
                onChange={(e) => setForm({ ...form, expiryAlertDays: parseInt(e.target.value) || 90 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Flag medicines expiring within this time</span>
            </div>
          </div>
        </div>

        {/* Notifications and Automation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Bell className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Automations & Notifications</h3>
              <p className="text-xs text-slate-500">System alerts and automatic order recommendations</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={form.emailAlerts}
                onChange={(e) => setForm({ ...form, emailAlerts: e.target.checked })}
                className="mt-0.5 rounded border-slate-300 text-sky-600"
              />
              <div>
                <span className="font-semibold text-slate-900 block">Daily Stock Digest Email</span>
                <span className="text-slate-500 text-[11px]">Send morning summary of low stock and expiring items to store email</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={form.autoReorderDrafts}
                onChange={(e) => setForm({ ...form, autoReorderDrafts: e.target.checked })}
                className="mt-0.5 rounded border-slate-300 text-sky-600"
              />
              <div>
                <span className="font-semibold text-slate-900 block">Auto-Draft Purchase Orders</span>
                <span className="text-slate-500 text-[11px]">Automatically prepare draft purchase orders when medicines breach safety limits</span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 font-bold text-sm text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Pharmacy Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
