import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Prescription } from '../../types';
import {
  ClipboardList,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  FileText,
  User,
  Stethoscope,
  Calendar,
  X,
  ShoppingCart
} from 'lucide-react';

export const PrescriptionsView: React.FC = () => {
  const {
    prescriptions,
    addPrescription,
    updatePrescriptionStatus,
    dispensePrescriptionToPos,
    medicines,
    customers,
    searchQuery: globalSearchQuery
  } = usePharmacy();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Dispensed'>('All');
  const [viewingRx, setViewingRx] = useState<Prescription | null>(null);
  const [isAddRxModalOpen, setIsAddRxModalOpen] = useState(false);

  // New Rx state
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    doctorName: '',
    doctorRegistration: '',
    hospital: '',
    notes: '',
    medicines: [{ medicineName: medicines[0]?.name || 'Dolo 650', dosage: '1-0-1', duration: '5 days', instructions: 'After meals', quantity: 10 }]
  });

  const activeSearch = search || globalSearchQuery;

  const filteredRx = prescriptions.filter((rx) => {
    const matchSearch =
      !activeSearch ||
      rx.id.toLowerCase().includes(activeSearch.toLowerCase()) ||
      rx.customerName.toLowerCase().includes(activeSearch.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(activeSearch.toLowerCase());

    const matchStatus = statusFilter === 'All' || rx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: Prescription['status']) => {
    switch (status) {
      case 'Dispensed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Dispensed
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-sky-100 text-sky-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
    }
  };

  const handleAddMedicineRow = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { medicineName: medicines[0]?.name || '', dosage: '1-0-0', duration: '5 days', instructions: 'After food', quantity: 5 }
      ]
    });
  };

  const handleCreateRxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPrescription({
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: 'Approved'
    });
    setIsAddRxModalOpen(false);
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Prescription Management & Digital Dispensing
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Validate physician prescriptions, verify dosage schedules, and dispense directly into POS counter.
          </p>
        </div>

        <button
          onClick={() => setIsAddRxModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Prescription</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Rx by ID, patient name, or doctor..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
            {(['All', 'Pending', 'Approved', 'Dispensed'] as const).map((st) => (
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

      {/* Prescriptions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rx Number</th>
                <th className="py-3 px-3">Patient Name</th>
                <th className="py-3 px-3">Doctor & Reg No.</th>
                <th className="py-3 px-3">Hospital / Clinic</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-center">Medicines</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRx.map((rx) => (
                <tr key={rx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                    {rx.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{rx.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{rx.customerPhone}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800">{rx.doctorName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{rx.doctorRegistration}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 truncate max-w-[170px]" title={rx.hospital}>
                    {rx.hospital}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                    {rx.date}
                  </td>
                  <td className="py-3 px-3 text-center tabular-nums font-semibold text-slate-700">
                    {rx.medicines.length} drugs
                  </td>
                  <td className="py-3 px-3 text-center">
                    {getStatusBadge(rx.status)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingRx(rx)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                      >
                        View Rx
                      </button>

                      {rx.status !== 'Dispensed' && (
                        <button
                          onClick={() => dispensePrescriptionToPos(rx)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-teal-600 hover:bg-teal-700 text-white transition-colors flex items-center gap-1 cursor-pointer"
                          title="Load directly into POS cart"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Dispense to POS</span>
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

      {/* View Prescription Modal */}
      {viewingRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono text-teal-600 font-semibold">{viewingRx.id}</span>
                <h3 className="text-base font-bold text-slate-900">Physician Prescription Slip</h3>
                <p className="text-slate-500">{viewingRx.hospital}</p>
              </div>
              <button
                onClick={() => setViewingRx(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <span className="text-slate-400 block">Patient Name:</span>
                <span className="font-semibold text-slate-900">{viewingRx.customerName}</span>
                <span className="text-[11px] font-mono text-slate-500 block">{viewingRx.customerPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Prescribing Physician:</span>
                <span className="font-semibold text-slate-900">{viewingRx.doctorName}</span>
                <span className="text-[11px] font-mono text-slate-500 block">Reg: {viewingRx.doctorRegistration}</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Prescribed Medication Regimen</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3 text-left">Medicine</th>
                      <th className="py-2 px-2 text-center">Dosage</th>
                      <th className="py-2 px-2 text-center">Duration</th>
                      <th className="py-2 px-3 text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingRx.medicines.map((m, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3">
                          <p className="font-medium text-slate-900">{m.medicineName}</p>
                          <p className="text-[10px] text-slate-500">{m.instructions}</p>
                        </td>
                        <td className="py-2 px-2 text-center font-mono">{m.dosage}</td>
                        <td className="py-2 px-2 text-center">{m.duration}</td>
                        <td className="py-2 px-3 text-right font-bold tabular-nums">{m.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {viewingRx.notes && (
              <div className="p-2.5 bg-sky-50/60 border border-sky-100 rounded-lg text-slate-700">
                <strong>Clinical Notes:</strong> {viewingRx.notes}
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div>
                Status: {getStatusBadge(viewingRx.status)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewingRx(null)}
                  className="px-3 py-1.5 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Close
                </button>
                {viewingRx.status !== 'Dispensed' && (
                  <button
                    onClick={() => {
                      dispensePrescriptionToPos(viewingRx);
                      setViewingRx(null);
                    }}
                    className="px-3.5 py-1.5 font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Dispense in POS</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Rx Modal */}
      {isAddRxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-start justify-between pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Upload Digital Prescription</h3>
              <button
                onClick={() => setIsAddRxModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRxSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Patient Mobile *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+91 98200 99887"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    placeholder="Dr. Rajesh Verma, MD"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">MCI / State Reg No. *</label>
                  <input
                    type="text"
                    required
                    value={formData.doctorRegistration}
                    onChange={(e) => setFormData({ ...formData, doctorRegistration: e.target.value })}
                    placeholder="MCI-2016-5591"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Hospital / Medical Center</label>
                <input
                  type="text"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  placeholder="Lilavati Hospital & Research Centre"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 font-medium">Prescribed Medicines</label>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="text-sky-600 font-semibold"
                  >
                    + Add Drug
                  </button>
                </div>
                <div className="space-y-1.5">
                  {formData.medicines.map((m, idx) => (
                    <div key={idx} className="flex gap-2">
                      <select
                        value={m.medicineName}
                        onChange={(e) => {
                          const updated = [...formData.medicines];
                          updated[idx].medicineName = e.target.value;
                          setFormData({ ...formData, medicines: updated });
                        }}
                        className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        {medicines.map((med) => (
                          <option key={med.id} value={med.name}>
                            {med.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="1-0-1"
                        value={m.dosage}
                        onChange={(e) => {
                          const updated = [...formData.medicines];
                          updated[idx].dosage = e.target.value;
                          setFormData({ ...formData, medicines: updated });
                        }}
                        className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={m.quantity}
                        onChange={(e) => {
                          const updated = [...formData.medicines];
                          updated[idx].quantity = parseInt(e.target.value) || 1;
                          setFormData({ ...formData, medicines: updated });
                        }}
                        className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddRxModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg cursor-pointer"
                >
                  Save & Validate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
