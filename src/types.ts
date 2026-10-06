export type NavigationPage =
  | 'dashboard'
  | 'medicines'
  | 'inventory'
  | 'pos'
  | 'purchases'
  | 'suppliers'
  | 'customers'
  | 'prescriptions'
  | 'lowstock'
  | 'expiry'
  | 'reports'
  | 'settings';

export type MedicineCategory =
  | 'Antibiotics'
  | 'Analgesics & Pain'
  | 'Antidiabetic'
  | 'Cardiac & Hypertension'
  | 'Respiratory'
  | 'Gastrointestinal'
  | 'Vitamins & Supplements'
  | 'Dermatology'
  | 'Anti-Allergic';

export type MedicineStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expiring Soon' | 'Expired';

export interface Medicine {
  id: string; // e.g. "MED-1001"
  name: string; // e.g. "Dolo 650"
  genericName: string; // e.g. "Paracetamol 650mg"
  category: MedicineCategory;
  manufacturer: string; // e.g. "Micro Labs Ltd"
  batchNo: string; // e.g. "BT-9428"
  quantity: number; // in strips or units
  minStock: number;
  purchasePrice: number; // ₹
  sellingPrice: number; // ₹
  expiryDate: string; // "YYYY-MM-DD"
  supplier: string;
  prescriptionRequired: boolean;
  shelfLocation: string; // e.g. "Rack A-04"
  dosageForm: string; // "Tablet", "Capsule", "Syrup", "Injection", "Ointment"
  strength: string; // "650mg", "500mg", "100ml"
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
  discount: number; // percentage
}

export interface Sale {
  id: string; // e.g. "INV-2026-104"
  date: string; // ISO string
  customerName: string;
  customerPhone: string;
  items: {
    medicineId: string;
    medicineName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    batchNo: string;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card';
  status: 'Completed' | 'Refunded';
}

export interface PurchaseOrder {
  id: string; // e.g. "PO-2026-042"
  supplierId: string;
  supplierName: string;
  orderDate: string;
  deliveryDate?: string;
  itemsCount: number;
  totalAmount: number;
  status: 'Pending' | 'Received' | 'Cancelled';
  items: {
    medicineName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

export interface Supplier {
  id: string; // e.g. "SUP-101"
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  medicinesSupplied: number;
  totalPurchases: number;
  status: 'Active' | 'Inactive';
  gstin: string;
}

export interface Customer {
  id: string; // e.g. "CUST-1042"
  name: string;
  phone: string;
  email: string;
  address: string;
  totalPurchases: number;
  totalVisits: number;
  lastPurchase: string;
  chronicCondition?: string;
}

export interface Prescription {
  id: string; // e.g. "RX-9941"
  customerName: string;
  customerPhone: string;
  doctorName: string;
  doctorRegistration: string;
  hospital: string;
  date: string;
  medicines: {
    medicineName: string;
    dosage: string; // e.g. "1-0-1"
    duration: string; // e.g. "5 days"
    instructions: string; // e.g. "After meals"
    quantity: number;
  }[];
  status: 'Pending' | 'Approved' | 'Dispensed';
  notes?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'sale' | 'inventory' | 'prescription' | 'purchase' | 'alert';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  time: string;
  read: boolean;
  targetPage?: NavigationPage;
}

export interface PharmacySettings {
  pharmacyName: string;
  tagline: string;
  drugLicenseNo: string;
  gstin: string;
  address: string;
  phone: string;
  email: string;
  taxPercentage: number;
  currencySymbol: string;
  currencyCode: string;
  lowStockThreshold: number;
  expiryAlertDays: number;
  emailAlerts: boolean;
  smsAlerts: boolean;
  autoReorderDrafts: boolean;
}
