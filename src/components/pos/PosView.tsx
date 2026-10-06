import React, { useState, useMemo } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Medicine, MedicineCategory, Sale } from '../../types';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  CreditCard,
  QrCode,
  Banknote,
  Receipt,
  User,
  Percent,
  Pill,
  Sparkles,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';

const CATEGORIES: ('All' | MedicineCategory)[] = [
  'All',
  'Analgesics & Pain',
  'Antibiotics',
  'Antidiabetic',
  'Cardiac & Hypertension',
  'Respiratory',
  'Gastrointestinal',
  'Vitamins & Supplements',
  'Dermatology',
  'Anti-Allergic'
];

export const PosView: React.FC = () => {
  const {
    medicines,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    completeSale,
    customers,
    settings,
    searchQuery: globalSearchQuery
  } = usePharmacy();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | MedicineCategory>('All');
  
  // Customer selection
  const [customerType, setCustomerType] = useState<'walkin' | 'registered'>('walkin');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [walkinName, setWalkinName] = useState<string>('Walk-in Patient');
  const [walkinPhone, setWalkinPhone] = useState<string>('+91 99000 00000');

  // Pricing & payment options
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card'>('UPI');
  const [showUpiQr, setShowUpiQr] = useState<boolean>(false);

  // Success completed sale modal
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const activeSearch = searchTerm || globalSearchQuery;

  // Filter medicines
  const filteredCatalog = useMemo(() => {
    return medicines.filter((m) => {
      const matchSearch =
        !activeSearch ||
        m.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        m.genericName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        m.batchNo.toLowerCase().includes(activeSearch.toLowerCase());

      const matchCategory = selectedCategory === 'All' || m.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [medicines, activeSearch, selectedCategory]);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.medicine.sellingPrice * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * settings.taxPercentage) / 100;
  const grandTotal = taxableAmount + taxAmount;

  // Customer info resolution
  const activeCustomer = useMemo(() => {
    if (customerType === 'registered' && selectedCustomerId) {
      return customers.find((c) => c.id === selectedCustomerId);
    }
    return null;
  }, [customerType, selectedCustomerId, customers]);

  const handleCompleteSaleClick = () => {
    if (cart.length === 0) return;

    const customerName = activeCustomer ? activeCustomer.name : walkinName;
    const customerPhone = activeCustomer ? activeCustomer.phone : walkinPhone;

    const createdSale = completeSale({
      customerName,
      customerPhone,
      paymentMethod,
      discountPercent
    });

    setCompletedSale(createdSale);
    // Reset defaults
    setDiscountPercent(0);
    setShowUpiQr(false);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Point of Sale (POS) Counter
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Fast billing counter, prescription item dispensing, GST invoicing, and real-time inventory deduction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 bg-white border border-slate-200 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Catalog, Search, Categories (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Filter */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search prescription or OTC medicine by name or generic formula..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Category horizontal scroll buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Medicine Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[680px] overflow-y-auto pr-1">
            {filteredCatalog.map((med) => {
              const inCartItem = cart.find((c) => c.medicine.id === med.id);
              const isOutOfStock = med.quantity <= 0;

              return (
                <div
                  key={med.id}
                  className={`bg-white p-3.5 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                    isOutOfStock
                      ? 'border-slate-200 opacity-60 bg-slate-50'
                      : inCartItem
                      ? 'border-sky-400 bg-sky-50/20 shadow-xs'
                      : 'border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 font-mono block">{med.id}</span>
                        <h4 className="text-sm font-bold text-slate-900 truncate">{med.name}</h4>
                      </div>
                      <span className="text-sm font-bold text-slate-900 tabular-nums shrink-0 font-mono">
                        {settings.currencySymbol}{med.sellingPrice.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1 mb-1.5">{med.genericName}</p>

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] mb-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {med.dosageForm}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        {med.shelfLocation}
                      </span>
                      {med.prescriptionRequired && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-200/60">
                          Rx Required
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        isOutOfStock
                          ? 'text-rose-600'
                          : med.quantity <= med.minStock
                          ? 'text-amber-600'
                          : 'text-emerald-700'
                      }`}
                    >
                      {isOutOfStock ? 'Out of Stock' : `${med.quantity} in stock`}
                    </span>

                    <button
                      disabled={isOutOfStock}
                      onClick={() => addToCart(med)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                        isOutOfStock
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : inCartItem
                          ? 'bg-sky-600 text-white hover:bg-sky-700'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{inCartItem ? `Added (${inCartItem.quantity})` : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Shopping Cart & Checkout Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Current Cart</h3>
                <p className="text-xs text-slate-500">{cart.length} unique medicine items</p>
              </div>
            </div>

            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              Order Draft
            </span>
          </div>

          {/* Customer Selection Box */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Customer / Patient
              </span>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setCustomerType('walkin')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    customerType === 'walkin' ? 'bg-white shadow-2xs font-semibold text-slate-900' : 'text-slate-500'
                  }`}
                >
                  Walk-in
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType('registered')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    customerType === 'registered' ? 'bg-white shadow-2xs font-semibold text-slate-900' : 'text-slate-500'
                  }`}
                >
                  Registered
                </button>
              </div>
            </div>

            {customerType === 'registered' ? (
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="">Select registered patient...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder="Patient Name"
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs"
                />
                <input
                  type="text"
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  placeholder="Contact Mobile"
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs"
                />
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="max-h-60 overflow-y-auto space-y-2 divide-y divide-slate-100 pr-1">
            {cart.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <ShoppingCart className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                <p className="text-xs font-medium text-slate-500">Cart is currently empty</p>
                <p className="text-[11px] text-slate-400">Select medicines from the left panel to begin sale</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.medicine.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="font-semibold text-slate-900 truncate">{item.medicine.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {settings.currencySymbol}{item.medicine.sellingPrice.toFixed(2)} each • Batch {item.medicine.batchNo}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateCartQuantity(item.medicine.id, item.quantity - 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-1 font-mono font-semibold text-slate-800 tabular-nums text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.medicine.id, item.quantity + 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="w-16 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {settings.currencySymbol}{(item.medicine.sellingPrice * item.quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.medicine.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing & Discounts */}
          <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono tabular-nums text-slate-800 font-semibold">
                {settings.currencySymbol}{subtotal.toFixed(2)}
              </span>
            </div>

            {/* Discount selector */}
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-slate-400" />
                Discount:
              </span>
              <div className="flex items-center gap-1">
                {[0, 5, 10].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountPercent(pct)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                      discountPercent === pct
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-emerald-700">
                <span>Discount Deduction ({discountPercent}%):</span>
                <span className="font-mono tabular-nums font-semibold">
                  -{settings.currencySymbol}{discountAmount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-600">
              <span>GST Tax ({settings.taxPercentage}%):</span>
              <span className="font-mono tabular-nums text-slate-800">
                {settings.currencySymbol}{taxAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
              <span>Grand Total:</span>
              <span className="text-lg font-mono text-teal-700 tabular-nums">
                {settings.currencySymbol}{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-slate-700 block">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('UPI');
                  setShowUpiQr(true);
                }}
                className={`py-2 px-2.5 rounded-lg border flex flex-col items-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'border-teal-500 bg-teal-50/50 text-teal-800 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-4 h-4 text-teal-600" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('Cash');
                  setShowUpiQr(false);
                }}
                className={`py-2 px-2.5 rounded-lg border flex flex-col items-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'Cash'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Cash</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('Card');
                  setShowUpiQr(false);
                }}
                className={`py-2 px-2.5 rounded-lg border flex flex-col items-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'Card'
                    ? 'border-sky-500 bg-sky-50/50 text-sky-800 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-sky-600" />
                <span>Card / POS</span>
              </button>
            </div>
          </div>

          {/* UPI QR preview notice if selected */}
          {paymentMethod === 'UPI' && showUpiQr && (
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3 text-xs">
              <div className="w-10 h-10 bg-white border border-slate-300 rounded flex items-center justify-center shrink-0">
                <QrCode className="w-6 h-6 text-teal-700" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">Scan to Pay via UPI</p>
                <p className="text-[11px] text-slate-500 font-mono">arogyamedplus@okhdfcbank</p>
              </div>
            </div>
          )}

          {/* Complete Sale Action */}
          <button
            disabled={cart.length === 0}
            onClick={handleCompleteSaleClick}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
              cart.length === 0
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99]'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Complete Sale ({settings.currencySymbol}{grandTotal.toFixed(2)})</span>
          </button>
        </div>
      </div>

      {/* Completed Sale Tax Invoice Dialog */}
      <InvoiceReceiptModal
        sale={completedSale}
        settings={settings}
        isOpen={Boolean(completedSale)}
        onClose={() => setCompletedSale(null)}
      />
    </div>
  );
};
