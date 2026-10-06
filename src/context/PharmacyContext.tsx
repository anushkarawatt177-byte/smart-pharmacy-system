import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  NavigationPage,
  Medicine,
  CartItem,
  Sale,
  PurchaseOrder,
  Supplier,
  Customer,
  Prescription,
  ActivityItem,
  AppNotification,
  PharmacySettings
} from '../types';
import {
  INITIAL_MEDICINES,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASES,
  INITIAL_PRESCRIPTIONS,
  INITIAL_SALES,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info';
}

interface PharmacyContextType {
  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Medicines
  medicines: Medicine[];
  addMedicine: (med: Omit<Medicine, 'id'>) => Medicine;
  updateMedicine: (id: string, updated: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  adjustStock: (id: string, amount: number, reason: string) => void;

  // POS / Cart
  cart: CartItem[];
  addToCart: (med: Medicine, qty?: number) => void;
  updateCartQuantity: (medicineId: string, quantity: number) => void;
  removeFromCart: (medicineId: string) => void;
  clearCart: () => void;
  completeSale: (data: {
    customerName: string;
    customerPhone: string;
    paymentMethod: 'Cash' | 'UPI' | 'Card';
    discountPercent: number;
  }) => Sale;
  sales: Sale[];

  // Purchases
  purchases: PurchaseOrder[];
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => PurchaseOrder;
  updatePurchaseStatus: (id: string, status: 'Pending' | 'Received' | 'Cancelled') => void;

  // Suppliers
  suppliers: Supplier[];
  addSupplier: (sup: Omit<Supplier, 'id'>) => Supplier;
  updateSupplier: (id: string, updated: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Customers
  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id' | 'totalPurchases' | 'totalVisits' | 'lastPurchase'>) => Customer;

  // Prescriptions
  prescriptions: Prescription[];
  addPrescription: (rx: Omit<Prescription, 'id'>) => Prescription;
  updatePrescriptionStatus: (id: string, status: 'Pending' | 'Approved' | 'Dispensed') => void;
  dispensePrescriptionToPos: (rx: Prescription) => void;

  // Notifications & Activities
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  activities: ActivityItem[];

  // Settings
  settings: PharmacySettings;
  updateSettings: (newSettings: Partial<PharmacySettings>) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Derived Dashboard Stats
  dashboardStats: {
    totalMedicines: number;
    totalInventory: number;
    todaySales: number;
    todayOrders: number;
    totalCustomers: number;
    lowStockCount: number;
    expiringSoonCount: number;
    inventoryValue: number;
  };
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<NavigationPage>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [purchases, setPurchases] = useState<PurchaseOrder[]>(INITIAL_PURCHASES);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [settings, setSettings] = useState<PharmacySettings>(INITIAL_SETTINGS);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast helper
  const showToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Medicine operations
  const addMedicine = (medData: Omit<Medicine, 'id'>): Medicine => {
    const newId = `MED-${1000 + medicines.length + 1}`;
    const newMedicine: Medicine = {
      ...medData,
      id: newId
    };
    setMedicines((prev) => [newMedicine, ...prev]);

    // Record activity
    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        title: 'New Medicine Added',
        description: `${newMedicine.name} (${newMedicine.genericName}) cataloged into ${newMedicine.shelfLocation}`,
        timestamp: 'Just now',
        type: 'inventory'
      },
      ...prev
    ]);

    showToast('Medicine Registered', `${newMedicine.name} added to inventory.`, 'success');
    return newMedicine;
  };

  const updateMedicine = (id: string, updated: Partial<Medicine>) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
    );
    showToast('Inventory Updated', 'Medicine specifications updated successfully.', 'info');
  };

  const deleteMedicine = (id: string) => {
    const target = medicines.find((m) => m.id === id);
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    if (target) {
      showToast('Medicine Deleted', `${target.name} removed from inventory.`, 'info');
    }
  };

  const adjustStock = (id: string, amount: number, reason: string) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newQty = Math.max(0, m.quantity + amount);
          return { ...m, quantity: newQty };
        }
        return m;
      })
    );
    const med = medicines.find((m) => m.id === id);
    if (med) {
      setActivities((prev) => [
        {
          id: `ACT-${Date.now()}`,
          title: 'Stock Adjustment',
          description: `${med.name}: ${amount >= 0 ? '+' : ''}${amount} units (${reason})`,
          timestamp: 'Just now',
          type: 'inventory'
        },
        ...prev
      ]);
      showToast('Stock Adjusted', `${med.name} quantity updated (${amount >= 0 ? '+' : ''}${amount} units).`, 'success');
    }
  };

  // Cart / POS operations
  const addToCart = (med: Medicine, qty = 1) => {
    if (med.quantity <= 0) {
      showToast('Out of Stock', `${med.name} has no available inventory.`, 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.medicine.id === med.id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + qty, med.quantity);
        return prev.map((item) =>
          item.medicine.id === med.id ? { ...item, quantity: nextQty } : item
        );
      }
      return [...prev, { medicine: med, quantity: qty, discount: 0 }];
    });
    showToast('Added to Cart', `${med.name} added to POS bill.`, 'success');
  };

  const updateCartQuantity = (medicineId: string, quantity: number) => {
    const med = medicines.find((m) => m.id === medicineId);
    if (!med) return;
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    if (quantity > med.quantity) {
      showToast('Max Stock Reached', `Only ${med.quantity} units available in stock.`, 'info');
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.medicine.id === medicineId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (medicineId: string) => {
    setCart((prev) => prev.filter((item) => item.medicine.id !== medicineId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const completeSale = ({
    customerName,
    customerPhone,
    paymentMethod,
    discountPercent
  }: {
    customerName: string;
    customerPhone: string;
    paymentMethod: 'Cash' | 'UPI' | 'Card';
    discountPercent: number;
  }): Sale => {
    const saleId = `INV-2026-${1049 + sales.length}`;
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.medicine.sellingPrice * item.quantity, 0);
    const discount = (subtotal * discountPercent) / 100;
    const taxable = subtotal - discount;
    const tax = (taxable * settings.taxPercentage) / 100;
    const totalAmount = taxable + tax;

    const saleItems = cart.map((item) => ({
      medicineId: item.medicine.id,
      medicineName: item.medicine.name,
      quantity: item.quantity,
      unitPrice: item.medicine.sellingPrice,
      total: item.medicine.sellingPrice * item.quantity,
      batchNo: item.medicine.batchNo
    }));

    const newSale: Sale = {
      id: saleId,
      date: new Date().toISOString(),
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '+91 99000 00000',
      items: saleItems,
      subtotal,
      discount,
      tax,
      totalAmount,
      paymentMethod,
      status: 'Completed'
    };

    // Deduct stock from inventory
    setMedicines((prev) =>
      prev.map((m) => {
        const cartItem = cart.find((ci) => ci.medicine.id === m.id);
        if (cartItem) {
          return {
            ...m,
            quantity: Math.max(0, m.quantity - cartItem.quantity)
          };
        }
        return m;
      })
    );

    // Save sale
    setSales((prev) => [newSale, ...prev]);

    // Update customer stats if existing
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.phone === customerPhone || c.name.toLowerCase() === customerName.toLowerCase()) {
          return {
            ...c,
            totalPurchases: c.totalPurchases + totalAmount,
            totalVisits: c.totalVisits + 1,
            lastPurchase: new Date().toISOString().split('T')[0]
          };
        }
        return c;
      })
    );

    // Record activity
    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        title: 'POS Sale Completed',
        description: `Invoice #${newSale.id} generated for ${newSale.customerName} (${settings.currencySymbol}${totalAmount.toFixed(2)} via ${paymentMethod})`,
        timestamp: 'Just now',
        type: 'sale'
      },
      ...prev
    ]);

    // Clear cart
    clearCart();
    showToast('Sale Completed', `Invoice #${newSale.id} created successfully!`, 'success');

    return newSale;
  };

  // Purchases operations
  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id'>): PurchaseOrder => {
    const newId = `PO-2026-${String(90 + purchases.length).padStart(3, '0')}`;
    const newPO: PurchaseOrder = {
      ...poData,
      id: newId
    };
    setPurchases((prev) => [newPO, ...prev]);

    // Add to activity
    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        title: 'Purchase Order Placed',
        description: `Order #${newPO.id} raised for ${newPO.supplierName} (${settings.currencySymbol}${newPO.totalAmount.toLocaleString()})`,
        timestamp: 'Just now',
        type: 'purchase'
      },
      ...prev
    ]);

    showToast('Purchase Order Created', `Order #${newPO.id} generated.`, 'success');
    return newPO;
  };

  const updatePurchaseStatus = (id: string, status: 'Pending' | 'Received' | 'Cancelled') => {
    setPurchases((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status } : po))
    );
    showToast('Purchase Updated', `Order #${id} status changed to ${status}.`, 'info');
  };

  // Supplier operations
  const addSupplier = (supData: Omit<Supplier, 'id'>): Supplier => {
    const newId = `SUP-${100 + suppliers.length + 1}`;
    const newSup: Supplier = {
      ...supData,
      id: newId
    };
    setSuppliers((prev) => [...prev, newSup]);
    showToast('Supplier Added', `${newSup.name} added to vendor network.`, 'success');
    return newSup;
  };

  const updateSupplier = (id: string, updated: Partial<Supplier>) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    showToast('Supplier Updated', 'Vendor profile updated.', 'info');
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    showToast('Supplier Removed', 'Vendor deleted from directory.', 'info');
  };

  // Customer operations
  const addCustomer = (custData: Omit<Customer, 'id' | 'totalPurchases' | 'totalVisits' | 'lastPurchase'>): Customer => {
    const newId = `CUST-${1000 + customers.length + 1}`;
    const newCust: Customer = {
      ...custData,
      id: newId,
      totalPurchases: 0,
      totalVisits: 1,
      lastPurchase: new Date().toISOString().split('T')[0]
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast('Customer Registered', `${newCust.name} added to customer directory.`, 'success');
    return newCust;
  };

  // Prescription operations
  const addPrescription = (rxData: Omit<Prescription, 'id'>): Prescription => {
    const newId = `RX-${9940 + prescriptions.length + 1}`;
    const newRx: Prescription = {
      ...rxData,
      id: newId
    };
    setPrescriptions((prev) => [newRx, ...prev]);
    showToast('Prescription Added', `Rx #${newRx.id} uploaded.`, 'success');
    return newRx;
  };

  const updatePrescriptionStatus = (id: string, status: 'Pending' | 'Approved' | 'Dispensed') => {
    setPrescriptions((prev) =>
      prev.map((rx) => (rx.id === id ? { ...rx, status } : rx))
    );
    showToast('Prescription Updated', `Rx #${id} status changed to ${status}.`, 'info');
  };

  const dispensePrescriptionToPos = (rx: Prescription) => {
    // Clear cart or add to cart
    clearCart();
    let loadedCount = 0;
    rx.medicines.forEach((rxMed) => {
      const match = medicines.find(
        (m) =>
          m.name.toLowerCase().includes(rxMed.medicineName.toLowerCase()) ||
          rxMed.medicineName.toLowerCase().includes(m.name.toLowerCase())
      );
      if (match) {
        addToCart(match, Math.min(rxMed.quantity || 1, match.quantity || 1));
        loadedCount++;
      }
    });

    // Mark prescription as Dispensed
    updatePrescriptionStatus(rx.id, 'Dispensed');
    setActivePage('pos');
    showToast(
      'Loaded into POS',
      `Loaded ${loadedCount} prescription items into POS checkout for ${rx.customerName}.`,
      'success'
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Notifications Cleared', 'All alerts marked as read.', 'info');
  };

  // Settings
  const updateSettings = (newSettings: Partial<PharmacySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings Saved', 'Pharmacy configuration successfully updated.', 'success');
  };

  // Computed Dashboard Metrics
  const dashboardStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Today sales from real sales array
    const todaysSalesArray = sales.filter((s) => s.date.startsWith(today));
    const dynamicSalesTotal = todaysSalesArray.reduce((acc, s) => acc + s.totalAmount, 0);
    const dynamicSalesCount = todaysSalesArray.length;

    // Baseline realistic values as requested:
    // Today's Sales: ₹48,650 baseline + dynamic additions
    // Today's Orders: 126 baseline + dynamic additions
    const totalTodaySales = 48650 + (dynamicSalesTotal > 0 ? dynamicSalesTotal - 413.05 : 0);
    const totalTodayOrders = 126 + (dynamicSalesCount > 0 ? dynamicSalesCount - 1 : 0);

    const lowStockItems = medicines.filter((m) => m.quantity <= m.minStock && m.quantity > 0);
    const outOfStockItems = medicines.filter((m) => m.quantity === 0);
    
    // Expiring within 90 days
    const now = new Date('2026-10-06');
    const expiringSoonItems = medicines.filter((m) => {
      const exp = new Date(m.expiryDate);
      const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 90 && diffDays > 0;
    });

    const inventoryVal = medicines.reduce((acc, m) => acc + m.quantity * m.purchasePrice, 0);
    const totalUnits = medicines.reduce((acc, m) => acc + m.quantity, 0);

    return {
      totalMedicines: 1248 + (medicines.length - INITIAL_MEDICINES.length),
      totalInventory: 14620 + totalUnits,
      todaySales: Math.round(totalTodaySales),
      todayOrders: totalTodayOrders,
      totalCustomers: 2840 + (customers.length - INITIAL_CUSTOMERS.length),
      lowStockCount: 18 + lowStockItems.length - 5, // scaled to baseline
      expiringSoonCount: 12 + expiringSoonItems.length - 4,
      inventoryValue: 842300 + Math.round(inventoryVal)
    };
  }, [medicines, sales, customers]);

  return (
    <PharmacyContext.Provider
      value={{
        activePage,
        setActivePage,
        searchQuery,
        setSearchQuery,
        medicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        adjustStock,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        completeSale,
        sales,
        purchases,
        addPurchaseOrder,
        updatePurchaseStatus,
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        customers,
        addCustomer,
        prescriptions,
        addPrescription,
        updatePrescriptionStatus,
        dispensePrescriptionToPos,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        activities,
        settings,
        updateSettings,
        toasts,
        showToast,
        removeToast,
        dashboardStats
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
