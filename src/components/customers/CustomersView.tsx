import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Customer } from '../../types';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Calendar,
  HeartPulse,
  Eye,
  IndianRupee,
  ShoppingBag,
  X
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const {
    customers,
    addCustomer,
    settings,
    sales,
    setActivePage,
    searchQuery: globalSearchQuery
  } = usePharmacy();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    chronicCondition: ''
  });

  const activeSearch = search || globalSearchQuery;

  const filteredCustomers = customers.filter(
    (c) =>
      !activeSearch ||
      c.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      c.phone.includes(activeSearch) ||
      c.email.toLowerCase().includes(activeSearch.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(formData);
    setFormData({ name: '', phone: '', email: '', address: '', chronicCondition: '' });
    setIsAddModalOpen(false);
  };

  // Find customer's sales
  const customerSales = viewingCustomer
    ? sales.filter(
        (s) =>
          s.customerPhone === viewingCustomer.phone ||
          s.customerName.toLowerCase() === viewingCustomer.name.toLowerCase()
      )
    : [];

  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Customer & Patient Registry
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Maintain patient profiles, repeat prescription customers, chronic care tracking, and loyalty history.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient by name, mobile number, or email..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-3">Patient Name</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Chronic Condition</th>
                <th className="py-3 px-3 text-right">Total Purchases</th>
                <th className="py-3 px-3">Last Purchase</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {c.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="text-[10px] text-slate-400">{c.totalVisits} dispensary visits</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                    {c.phone}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {c.email}
                  </td>
                  <td className="py-3 px-3">
                    {c.chronicCondition ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/50">
                        <HeartPulse className="w-3 h-3" /> {c.chronicCondition}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">None logged</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">
                    {settings.currencySymbol}{c.totalPurchases.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    {c.lastPurchase}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setViewingCustomer(c)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                    >
                      History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Register New Patient</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ananya S. Deshmukh"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Mobile Phone *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98200 12345"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="patient@gmail.com"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Flat 402, Sea View Apts, Mumbai"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Chronic Medical Condition / Tag</label>
                <input
                  type="text"
                  value={formData.chronicCondition}
                  onChange={(e) => setFormData({ ...formData, chronicCondition: e.target.value })}
                  placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg cursor-pointer"
                >
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Details & History Modal */}
      {viewingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <span className="text-[11px] font-mono text-slate-400">{viewingCustomer.id}</span>
                <h3 className="text-base font-bold text-slate-900">{viewingCustomer.name}</h3>
                <p className="text-slate-600">{viewingCustomer.phone} • {viewingCustomer.email}</p>
              </div>
              <button
                onClick={() => setViewingCustomer(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                <div>
                  <span className="text-slate-400 block">Total Pharmacy Spend:</span>
                  <span className="font-bold text-teal-700 text-sm">
                    {settings.currencySymbol}{viewingCustomer.totalPurchases.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Visits Logged:</span>
                  <span className="font-semibold text-slate-900">{viewingCustomer.totalVisits} orders</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">Chronic Care Notes:</span>
                  <span className="font-medium text-slate-800">
                    {viewingCustomer.chronicCondition || 'No chronic alerts specified'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Recent Invoiced Orders</h4>
                {customerSales.length === 0 ? (
                  <p className="text-slate-400 italic">No counter sales recorded under this phone number yet.</p>
                ) : (
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                    {customerSales.map((s) => (
                      <div key={s.id} className="p-2.5 flex items-center justify-between">
                        <div>
                          <p className="font-mono font-medium text-slate-900">{s.id}</p>
                          <p className="text-[11px] text-slate-500">{new Date(s.date).toLocaleDateString()} • {s.items.length} items</p>
                        </div>
                        <span className="font-bold text-slate-900">
                          {settings.currencySymbol}{s.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setViewingCustomer(null)}
                className="px-4 py-1.5 font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
