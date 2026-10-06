import React from 'react';
import { Sale, PharmacySettings } from '../../types';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';

interface InvoiceReceiptModalProps {
  sale: Sale | null;
  settings: PharmacySettings;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  sale,
  settings,
  isOpen,
  onClose
}) => {
  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(sale.date).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Top toolbar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-emerald-100 text-emerald-700">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-slate-800">
              Tax Invoice & Receipt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable invoice body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 print:p-0 print:m-0">
          {/* Header */}
          <div className="text-center pb-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">{settings.pharmacyName}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{settings.tagline}</p>
            <p className="text-xs text-slate-600 mt-1">{settings.address}</p>
            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 font-mono mt-1">
              <span>DL: {settings.drugLicenseNo}</span>
              <span>•</span>
              <span>GSTIN: {settings.gstin}</span>
            </div>
          </div>

          {/* Invoice & Customer details */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <div>
              <p className="text-slate-500">Invoice No:</p>
              <p className="font-mono font-semibold text-slate-900">{sale.id}</p>
              <p className="text-slate-500 mt-2">Date & Time:</p>
              <p className="font-medium text-slate-800">{formattedDate}</p>
            </div>
            <div>
              <p className="text-slate-500">Billed To:</p>
              <p className="font-semibold text-slate-900">{sale.customerName}</p>
              <p className="text-slate-500 mt-2">Payment Method:</p>
              <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] inline-block">
                {sale.paymentMethod} Verified
              </span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-100/80 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3 text-left">Item Description</th>
                  <th className="py-2 px-2 text-center">Batch</th>
                  <th className="py-2 px-2 text-right">Qty</th>
                  <th className="py-2 px-2 text-right">Rate</th>
                  <th className="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {sale.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 text-slate-800">{item.medicineName}</td>
                    <td className="py-2 px-2 text-center text-slate-500 font-mono text-[11px]">
                      {item.batchNo}
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums">{item.quantity}</td>
                    <td className="py-2 px-2 text-right tabular-nums">
                      {settings.currencySymbol}{item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums font-semibold">
                      {settings.currencySymbol}{item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="space-y-1.5 text-xs border-t border-slate-200 pt-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="tabular-nums font-mono">
                {settings.currencySymbol}{sale.subtotal.toFixed(2)}
              </span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount Applied:</span>
                <span className="tabular-nums font-mono">
                  -{settings.currencySymbol}{sale.discount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>GST ({settings.taxPercentage}%):</span>
              <span className="tabular-nums font-mono">
                {settings.currencySymbol}{sale.tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
              <span>Grand Total:</span>
              <span className="tabular-nums font-mono text-base text-teal-700">
                {settings.currencySymbol}{sale.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Verification stamp & Disclaimer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-teal-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Dispensed by Registered Pharmacist</span>
            </div>
            <span className="italic">Computer Generated Invoice</span>
          </div>
        </div>

        {/* Modal footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
