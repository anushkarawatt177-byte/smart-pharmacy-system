import React, { useState, useMemo } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Medicine, MedicineCategory } from '../../types';
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ClockAlert,
  X,
  Building,
  Layers,
  MapPin,
  Pill,
  Sparkles
} from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';

const CATEGORIES: MedicineCategory[] = [
  'Antibiotics',
  'Analgesics & Pain',
  'Antidiabetic',
  'Cardiac & Hypertension',
  'Respiratory',
  'Gastrointestinal',
  'Vitamins & Supplements',
  'Dermatology',
  'Anti-Allergic'
];

export const MedicinesView: React.FC = () => {
  const {
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    suppliers,
    settings,
    searchQuery: globalSearchQuery
  } = usePharmacy();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<string>('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [viewingMedicine, setViewingMedicine] = useState<Medicine | null>(null);
  const [deletingMedicineId, setDeletingMedicineId] = useState<string | null>(null);

  // Form state
  const initialFormState = {
    name: '',
    genericName: '',
    category: 'Antibiotics' as MedicineCategory,
    manufacturer: '',
    batchNo: '',
    purchasePrice: 0,
    sellingPrice: 0,
    quantity: 0,
    minStock: 20,
    expiryDate: '2027-12-31',
    supplier: suppliers[0]?.name || 'MedPlus Wholesale Logistics',
    prescriptionRequired: false,
    shelfLocation: 'Rack A-01',
    dosageForm: 'Tablet',
    strength: '500mg'
  };

  const [formData, setFormData] = useState(initialFormState);

  // Search query (combination of global search and local search)
  const activeSearch = localSearch || globalSearchQuery;

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      // Search
      const searchMatch =
        !activeSearch ||
        m.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        m.genericName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        m.manufacturer.toLowerCase().includes(activeSearch.toLowerCase()) ||
        m.batchNo.toLowerCase().includes(activeSearch.toLowerCase()) ||
        m.id.toLowerCase().includes(activeSearch.toLowerCase());

      // Category filter
      const categoryMatch = selectedCategory === 'All' || m.category === selectedCategory;

      // Stock filter
      let stockMatch = true;
      if (stockFilter === 'In Stock') stockMatch = m.quantity > m.minStock;
      else if (stockFilter === 'Low Stock') stockMatch = m.quantity <= m.minStock && m.quantity > 0;
      else if (stockFilter === 'Out of Stock') stockMatch = m.quantity === 0;
      else if (stockFilter === 'Expiring Soon') {
        const diffDays = Math.ceil((new Date(m.expiryDate).getTime() - new Date('2026-10-06').getTime()) / (1000 * 60 * 60 * 24));
        stockMatch = diffDays <= 90;
      }

      return searchMatch && categoryMatch && stockMatch;
    });
  }, [medicines, activeSearch, selectedCategory, stockFilter]);

  const getStatusBadge = (med: Medicine) => {
    const diffDays = Math.ceil((new Date(med.expiryDate).getTime() - new Date('2026-10-06').getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-700">
          <ClockAlert className="w-3 h-3" /> Expired
        </span>
      );
    }
    if (med.quantity === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-700">
          <XCircle className="w-3 h-3" /> Out of Stock
        </span>
      );
    }
    if (med.quantity <= med.minStock) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
          <AlertTriangle className="w-3 h-3" /> Low Stock
        </span>
      );
    }
    if (diffDays <= 90) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-100 text-orange-800">
          <ClockAlert className="w-3 h-3" /> Expiring
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
        <CheckCircle2 className="w-3 h-3" /> In Stock
      </span>
    );
  };

  const handleOpenAddModal = () => {
    setFormData(initialFormState);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (med: Medicine) => {
    setEditingMedicine(med);
    setFormData({
      name: med.name,
      genericName: med.genericName,
      category: med.category,
      manufacturer: med.manufacturer,
      batchNo: med.batchNo,
      purchasePrice: med.purchasePrice,
      sellingPrice: med.sellingPrice,
      quantity: med.quantity,
      minStock: med.minStock,
      expiryDate: med.expiryDate,
      supplier: med.supplier,
      prescriptionRequired: med.prescriptionRequired,
      shelfLocation: med.shelfLocation,
      dosageForm: med.dosageForm,
      strength: med.strength
    });
  };

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMedicine) {
      updateMedicine(editingMedicine.id, formData);
      setEditingMedicine(null);
    } else {
      addMedicine(formData);
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Medicine Catalog & Inventory Directory
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Manage pharmaceutical drugs, generics, batch codes, pricing, and stock status.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by brand name, generic, or batch..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 shrink-0 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="All">All Categories ({medicines.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 shrink-0 font-medium">Stock:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock (&gt; Min Buffer)</option>
              <option value="Low Stock">Low Stock (≤ Min Buffer)</option>
              <option value="Out of Stock">Out of Stock (Zero Units)</option>
              <option value="Expiring Soon">Expiring Soon (≤ 90 Days)</option>
            </select>
          </div>
        </div>

        {/* Quick result summary indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Showing <strong className="text-slate-800">{filteredMedicines.length}</strong> of {medicines.length} registered medicines</span>
          {(selectedCategory !== 'All' || stockFilter !== 'All' || activeSearch) && (
            <button
              onClick={() => {
                setLocalSearch('');
                setSelectedCategory('All');
                setStockFilter('All');
              }}
              className="text-sky-600 hover:text-sky-800 font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Medicine ID</th>
                <th className="py-3 px-3">Medicine Name</th>
                <th className="py-3 px-3">Generic Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Manufacturer</th>
                <th className="py-3 px-3">Batch No.</th>
                <th className="py-3 px-3 text-right">Quantity</th>
                <th className="py-3 px-3 text-right">Selling Price</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500">
                    <Pill className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No medicines match current criteria</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try clearing your search terms or filters</p>
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                      {med.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{med.name}</div>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {med.dosageForm} • {med.strength}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-[160px] truncate" title={med.genericName}>
                      {med.genericName}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {med.category}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-[130px] truncate">
                      {med.manufacturer}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {med.batchNo}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      <span className={`font-semibold ${med.quantity <= med.minStock ? 'text-amber-600' : 'text-slate-900'}`}>
                        {med.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-semibold text-slate-900">
                      {settings.currencySymbol}{med.sellingPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {med.expiryDate}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {getStatusBadge(med)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingMedicine(med)}
                          className="p-1 rounded text-slate-500 hover:text-sky-600 hover:bg-slate-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(med)}
                          className="p-1 rounded text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                          title="Edit Medicine"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingMedicineId(med.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                          title="Delete Medicine"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Medicine Modal */}
      {(isAddModalOpen || editingMedicine) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  {editingMedicine ? `Edit Medicine: ${editingMedicine.name}` : 'Register New Medicine to Formulary'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingMedicine(null);
                }}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMedicine} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dolo 650"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Generic / Active Chemical *</label>
                  <input
                    type="text"
                    required
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="e.g. Paracetamol 650mg"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as MedicineCategory })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Manufacturer *</label>
                  <input
                    type="text"
                    required
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="e.g. Micro Labs Ltd"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Batch Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.batchNo}
                    onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                    placeholder="e.g. BT-9428"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Shelf / Rack Location</label>
                  <input
                    type="text"
                    value={formData.shelfLocation}
                    onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                    placeholder="e.g. Rack A-02"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Purchase Price ({settings.currencySymbol}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Selling Price / MRP ({settings.currencySymbol}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Current Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Minimum Safety Buffer *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Distributor / Supplier</label>
                  <select
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  >
                    {suppliers.map((sup) => (
                      <option key={sup.id} value={sup.name}>
                        {sup.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prescription checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="prescriptionRequired"
                  checked={formData.prescriptionRequired}
                  onChange={(e) => setFormData({ ...formData, prescriptionRequired: e.target.checked })}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="prescriptionRequired" className="text-slate-700 font-medium cursor-pointer">
                  Schedule H / Rx Prescription Required for dispensing
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingMedicine(null);
                  }}
                  className="px-4 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer"
                >
                  {editingMedicine ? 'Update Medicine' : 'Save to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Medicine Details Modal */}
      {viewingMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400">{viewingMedicine.id}</span>
                <h3 className="text-lg font-bold text-slate-900">{viewingMedicine.name}</h3>
                <p className="text-xs text-slate-500">{viewingMedicine.genericName}</p>
              </div>
              <button
                onClick={() => setViewingMedicine(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <span className="text-slate-400 block">Category:</span>
                <span className="font-medium text-slate-800">{viewingMedicine.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Manufacturer:</span>
                <span className="font-medium text-slate-800">{viewingMedicine.manufacturer}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Batch No:</span>
                <span className="font-mono font-medium text-slate-800">{viewingMedicine.batchNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Location:</span>
                <span className="font-medium text-slate-800">{viewingMedicine.shelfLocation}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Purchase Cost:</span>
                <span className="font-mono text-slate-700">{settings.currencySymbol}{viewingMedicine.purchasePrice.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Selling Price:</span>
                <span className="font-mono font-bold text-emerald-700">{settings.currencySymbol}{viewingMedicine.sellingPrice.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Stock Units:</span>
                <span className="font-bold text-slate-900 tabular-nums">{viewingMedicine.quantity} units</span>
              </div>
              <div>
                <span className="text-slate-400 block">Expiry Date:</span>
                <span className="font-mono text-slate-800">{viewingMedicine.expiryDate}</span>
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-600">
              <p><strong>Supplier:</strong> {viewingMedicine.supplier}</p>
              <p>
                <strong>Prescription Rule:</strong>{' '}
                {viewingMedicine.prescriptionRequired ? (
                  <span className="text-rose-600 font-semibold">Strict Rx Required (Schedule H)</span>
                ) : (
                  <span className="text-emerald-600 font-semibold">OTC Permitted</span>
                )}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingMedicine(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={Boolean(deletingMedicineId)}
        title="Delete Medicine Record"
        message="Are you sure you want to delete this medicine? This will permanently remove its batch history and inventory counts."
        confirmLabel="Delete Medicine"
        isDestructive={true}
        onConfirm={() => {
          if (deletingMedicineId) {
            deleteMedicine(deletingMedicineId);
            setDeletingMedicineId(null);
          }
        }}
        onCancel={() => setDeletingMedicineId(null)}
      />
    </div>
  );
};
