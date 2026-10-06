import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Supplier } from '../../types';
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Building,
  X
} from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const SuppliersView: React.FC = () => {
  const {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    settings,
    searchQuery: globalSearchQuery
  } = usePharmacy();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplierId, setDeletingSupplierId] = useState<string | null>(null);

  const initialForm = {
    name: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    medicinesSupplied: 50,
    totalPurchases: 0,
    status: 'Active' as 'Active' | 'Inactive',
    gstin: '27AAAAA0000A1Z5'
  };

  const [formData, setFormData] = useState(initialForm);

  const activeSearch = search || globalSearchQuery;

  const filteredSuppliers = suppliers.filter(
    (s) =>
      !activeSearch ||
      s.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      s.company.toLowerCase().includes(activeSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(activeSearch.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplier(sup);
    setFormData({
      name: sup.name,
      company: sup.company,
      phone: sup.phone,
      email: sup.email,
      address: sup.address,
      medicinesSupplied: sup.medicinesSupplied,
      totalPurchases: sup.totalPurchases,
      status: sup.status,
      gstin: sup.gstin
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, formData);
      setEditingSupplier(null);
    } else {
      addSupplier(formData);
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Suppliers & Vendor Network
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Manage pharmaceutical wholesalers, distributors, delivery contacts, and purchase volumes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search suppliers by name, company, or contact info..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Supplier Name</th>
                <th className="py-3 px-3">Company</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3 text-center">Medicines Supplied</th>
                <th className="py-3 px-3 text-right">Total Purchases</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSuppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{sup.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{sup.id}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {sup.company}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    {sup.phone}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {sup.email}
                  </td>
                  <td className="py-3 px-3 text-center tabular-nums font-semibold text-slate-800">
                    {sup.medicinesSupplied} SKUs
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">
                    {settings.currencySymbol}{sup.totalPurchases.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingSupplier(sup)}
                        className="p-1 rounded text-slate-500 hover:text-sky-600 hover:bg-slate-100"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(sup)}
                        className="p-1 rounded text-slate-500 hover:text-emerald-600 hover:bg-slate-100"
                        title="Edit Supplier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingSupplierId(sup.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-slate-100"
                        title="Delete Supplier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Supplier Modal */}
      {(isAddModalOpen || editingSupplier) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingSupplier ? `Edit Supplier: ${editingSupplier.name}` : 'Register New Vendor / Distributor'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingSupplier(null);
                }}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Contact Person / Trade Rep *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. MedPlus Logistics"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Company Legal Entity *</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. MedPlus Healthcare Dist. Pvt Ltd"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 22 2844 9100"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="orders@supplier.in"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Warehouse / Depot Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Bhiwandi Pharma Logistics Park, Gala 102"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">GSTIN</label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingSupplier(null);
                  }}
                  className="px-4 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg cursor-pointer"
                >
                  {editingSupplier ? 'Save Updates' : 'Add Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Supplier Modal */}
      {viewingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-start justify-between pb-2 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono text-slate-400">{viewingSupplier.id}</span>
                <h3 className="text-base font-bold text-slate-900">{viewingSupplier.name}</h3>
                <p className="text-slate-600">{viewingSupplier.company}</p>
              </div>
              <button
                onClick={() => setViewingSupplier(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
              <p><strong>Phone:</strong> {viewingSupplier.phone}</p>
              <p><strong>Email:</strong> {viewingSupplier.email}</p>
              <p><strong>Warehouse Depot:</strong> {viewingSupplier.address}</p>
              <p><strong>GST Identification:</strong> <span className="font-mono">{viewingSupplier.gstin}</span></p>
              <p><strong>Catalog Portfolio:</strong> {viewingSupplier.medicinesSupplied} Active Medicines</p>
              <p><strong>All-Time Purchases:</strong> <span className="font-bold text-teal-700">{settings.currencySymbol}{viewingSupplier.totalPurchases.toLocaleString()}</span></p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingSupplier(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deletingSupplierId)}
        title="Remove Supplier"
        message="Are you sure you want to remove this vendor from your supplier directory? Active purchase orders will remain recorded."
        confirmLabel="Remove Supplier"
        isDestructive={true}
        onConfirm={() => {
          if (deletingSupplierId) {
            deleteSupplier(deletingSupplierId);
            setDeletingSupplierId(null);
          }
        }}
        onCancel={() => setDeletingSupplierId(null)}
      />
    </div>
  );
};
