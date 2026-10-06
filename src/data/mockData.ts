import {
  Medicine,
  Supplier,
  Customer,
  PurchaseOrder,
  Prescription,
  Sale,
  ActivityItem,
  AppNotification,
  PharmacySettings
} from '../types';

export const INITIAL_SETTINGS: PharmacySettings = {
  pharmacyName: 'Arogya MedPlus Smart Pharmacy',
  tagline: 'Healthcare & Diagnostic Solutions',
  drugLicenseNo: 'DL-20B/21B-MH-492104',
  gstin: '27AAAAA0000A1Z5',
  address: 'Shop 12-14, Shree Balaji Arcade, Station Road, Mumbai - 400053',
  phone: '+91 98201 44521',
  email: 'care@arogyamedplus.in',
  taxPercentage: 12,
  currencySymbol: '₹',
  currencyCode: 'INR',
  lowStockThreshold: 20,
  expiryAlertDays: 90,
  emailAlerts: true,
  smsAlerts: false,
  autoReorderDrafts: true
};

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'MED-1001',
    name: 'Dolo 650',
    genericName: 'Paracetamol 650mg',
    category: 'Analgesics & Pain',
    manufacturer: 'Micro Labs Ltd',
    batchNo: 'BT-9428',
    quantity: 145,
    minStock: 40,
    purchasePrice: 22.50,
    sellingPrice: 33.60,
    expiryDate: '2027-08-15',
    supplier: 'MedPlus Wholesale Logistics',
    prescriptionRequired: false,
    shelfLocation: 'Rack A-01',
    dosageForm: 'Tablet',
    strength: '650mg'
  },
  {
    id: 'MED-1002',
    name: 'Augmentin 625 Duo',
    genericName: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    category: 'Antibiotics',
    manufacturer: 'GlaxoSmithKline Pharmaceuticals',
    batchNo: 'AUG-8812',
    quantity: 14,
    minStock: 30,
    purchasePrice: 154.00,
    sellingPrice: 204.50,
    expiryDate: '2026-11-20',
    supplier: 'Cipla Med Distributors',
    prescriptionRequired: true,
    shelfLocation: 'Rack B-03',
    dosageForm: 'Tablet',
    strength: '625mg'
  },
  {
    id: 'MED-1003',
    name: 'Glycomet 500 SR',
    genericName: 'Metformin Hydrochloride 500mg',
    category: 'Antidiabetic',
    manufacturer: 'USV Pvt Ltd',
    batchNo: 'GLY-4102',
    quantity: 12,
    minStock: 25,
    purchasePrice: 32.00,
    sellingPrice: 48.00,
    expiryDate: '2026-10-25', // Expiring in <30 days
    supplier: 'Sun Pharma Distribution',
    prescriptionRequired: true,
    shelfLocation: 'Rack C-02',
    dosageForm: 'Tablet',
    strength: '500mg'
  },
  {
    id: 'MED-1004',
    name: 'Telma 40',
    genericName: 'Telmisartan 40mg',
    category: 'Cardiac & Hypertension',
    manufacturer: 'Glenmark Pharmaceuticals',
    batchNo: 'TLM-7731',
    quantity: 68,
    minStock: 30,
    purchasePrice: 168.00,
    sellingPrice: 225.00,
    expiryDate: '2027-04-10',
    supplier: 'Reddys Healthcare Logistics',
    prescriptionRequired: true,
    shelfLocation: 'Rack C-05',
    dosageForm: 'Tablet',
    strength: '40mg'
  },
  {
    id: 'MED-1005',
    name: 'Pan 40',
    genericName: 'Pantoprazole Sodium 40mg',
    category: 'Gastrointestinal',
    manufacturer: 'Alkem Laboratories',
    batchNo: 'PAN-3301',
    quantity: 190,
    minStock: 50,
    purchasePrice: 105.00,
    sellingPrice: 155.00,
    expiryDate: '2027-12-01',
    supplier: 'MedPlus Wholesale Logistics',
    prescriptionRequired: false,
    shelfLocation: 'Rack A-04',
    dosageForm: 'Tablet',
    strength: '40mg'
  },
  {
    id: 'MED-1006',
    name: 'Azithral 500',
    genericName: 'Azithromycin 500mg',
    category: 'Antibiotics',
    manufacturer: 'Alembic Pharmaceuticals',
    batchNo: 'AZT-9011',
    quantity: 8,
    minStock: 20,
    purchasePrice: 92.00,
    sellingPrice: 132.00,
    expiryDate: '2026-11-05', // Expiring in <30 days & Low stock
    supplier: 'Cipla Med Distributors',
    prescriptionRequired: true,
    shelfLocation: 'Rack B-04',
    dosageForm: 'Tablet',
    strength: '500mg'
  },
  {
    id: 'MED-1007',
    name: 'Montair LC',
    genericName: 'Montelukast (10mg) + Levocetirizine (5mg)',
    category: 'Respiratory',
    manufacturer: 'Cipla Ltd',
    batchNo: 'MLC-1204',
    quantity: 85,
    minStock: 30,
    purchasePrice: 140.00,
    sellingPrice: 198.00,
    expiryDate: '2027-03-15',
    supplier: 'Cipla Med Distributors',
    prescriptionRequired: true,
    shelfLocation: 'Rack D-01',
    dosageForm: 'Tablet',
    strength: '15mg'
  },
  {
    id: 'MED-1008',
    name: 'Atorva 10',
    genericName: 'Atorvastatin 10mg',
    category: 'Cardiac & Hypertension',
    manufacturer: 'Zydus Lifesciences',
    batchNo: 'ATV-5561',
    quantity: 110,
    minStock: 35,
    purchasePrice: 78.00,
    sellingPrice: 112.00,
    expiryDate: '2027-07-22',
    supplier: 'Sun Pharma Distribution',
    prescriptionRequired: true,
    shelfLocation: 'Rack C-06',
    dosageForm: 'Tablet',
    strength: '10mg'
  },
  {
    id: 'MED-1009',
    name: 'Cetzine 10',
    genericName: 'Cetirizine Dihydrochloride 10mg',
    category: 'Anti-Allergic',
    manufacturer: 'Dr. Reddy\'s Laboratories',
    batchNo: 'CET-8192',
    quantity: 15,
    minStock: 25,
    purchasePrice: 14.50,
    sellingPrice: 24.00,
    expiryDate: '2026-12-10', // Expiring in <60 days
    supplier: 'Reddys Healthcare Logistics',
    prescriptionRequired: false,
    shelfLocation: 'Rack D-03',
    dosageForm: 'Tablet',
    strength: '10mg'
  },
  {
    id: 'MED-1010',
    name: 'Shelcal 500',
    genericName: 'Calcium (500mg) + Vitamin D3 (250 IU)',
    category: 'Vitamins & Supplements',
    manufacturer: 'Torrent Pharmaceuticals',
    batchNo: 'SHL-6610',
    quantity: 75,
    minStock: 30,
    purchasePrice: 94.00,
    sellingPrice: 139.00,
    expiryDate: '2027-10-30',
    supplier: 'Apex Pharma Hub',
    prescriptionRequired: false,
    shelfLocation: 'Rack E-01',
    dosageForm: 'Tablet',
    strength: '500mg'
  },
  {
    id: 'MED-1011',
    name: 'Becosules Z',
    genericName: 'B-Complex Forte + Vitamin C + Zinc',
    category: 'Vitamins & Supplements',
    manufacturer: 'Pfizer Ltd',
    batchNo: 'BCS-2091',
    quantity: 120,
    minStock: 40,
    purchasePrice: 38.00,
    sellingPrice: 56.50,
    expiryDate: '2027-09-18',
    supplier: 'Apex Pharma Hub',
    prescriptionRequired: false,
    shelfLocation: 'Rack E-02',
    dosageForm: 'Capsule',
    strength: 'Zinc Plus'
  },
  {
    id: 'MED-1012',
    name: 'Ascoril D Plus Syrup',
    genericName: 'Dextromethorphan + Phenylephrine + Chlorpheniramine',
    category: 'Respiratory',
    manufacturer: 'Glenmark Pharmaceuticals',
    batchNo: 'ASC-3341',
    quantity: 18,
    minStock: 25,
    purchasePrice: 88.00,
    sellingPrice: 129.00,
    expiryDate: '2026-12-28', // Expiring in <90 days
    supplier: 'MedPlus Wholesale Logistics',
    prescriptionRequired: false,
    shelfLocation: 'Rack D-04',
    dosageForm: 'Syrup',
    strength: '100ml'
  },
  {
    id: 'MED-1013',
    name: 'Combiflam',
    genericName: 'Ibuprofen (400mg) + Paracetamol (325mg)',
    category: 'Analgesics & Pain',
    manufacturer: 'Sanofi India Ltd',
    batchNo: 'CMB-7712',
    quantity: 210,
    minStock: 50,
    purchasePrice: 33.00,
    sellingPrice: 49.50,
    expiryDate: '2027-11-15',
    supplier: 'Sun Pharma Distribution',
    prescriptionRequired: false,
    shelfLocation: 'Rack A-03',
    dosageForm: 'Tablet',
    strength: '725mg'
  },
  {
    id: 'MED-1014',
    name: 'Thyronorm 50 mcg',
    genericName: 'Thyroxine Sodium 50mcg',
    category: 'Antidiabetic',
    manufacturer: 'Abbott Healthcare',
    batchNo: 'THY-9902',
    quantity: 9,
    minStock: 20,
    purchasePrice: 142.00,
    sellingPrice: 195.00,
    expiryDate: '2026-11-18', // Expiring in <60 days & low stock
    supplier: 'Apex Pharma Hub',
    prescriptionRequired: true,
    shelfLocation: 'Rack C-04',
    dosageForm: 'Tablet',
    strength: '50mcg'
  },
  {
    id: 'MED-1015',
    name: 'Betadine 10% Ointment',
    genericName: 'Povidone Iodine 10% w/w',
    category: 'Dermatology',
    manufacturer: 'Win-Medicare Pvt Ltd',
    batchNo: 'BET-5419',
    quantity: 45,
    minStock: 20,
    purchasePrice: 85.00,
    sellingPrice: 124.00,
    expiryDate: '2027-05-30',
    supplier: 'MedPlus Wholesale Logistics',
    prescriptionRequired: false,
    shelfLocation: 'Rack F-01',
    dosageForm: 'Ointment',
    strength: '20g'
  },
  {
    id: 'MED-1016',
    name: 'Clavam 625',
    genericName: 'Amoxicillin + Potassium Clavulanate',
    category: 'Antibiotics',
    manufacturer: 'Alkem Laboratories',
    batchNo: 'CLM-0199',
    quantity: 0, // Out of stock
    minStock: 25,
    purchasePrice: 160.00,
    sellingPrice: 218.00,
    expiryDate: '2027-01-20',
    supplier: 'Cipla Med Distributors',
    prescriptionRequired: true,
    shelfLocation: 'Rack B-01',
    dosageForm: 'Tablet',
    strength: '625mg'
  },
  {
    id: 'MED-1017',
    name: 'Gelusil MPS Antacid',
    genericName: 'Aluminium Hydroxide + Dimethicone + Magnesium',
    category: 'Gastrointestinal',
    manufacturer: 'Pfizer Ltd',
    batchNo: 'GEL-4402',
    quantity: 6, // Low stock
    minStock: 20,
    purchasePrice: 90.00,
    sellingPrice: 135.00,
    expiryDate: '2026-09-15', // Already Expired
    supplier: 'Apex Pharma Hub',
    prescriptionRequired: false,
    shelfLocation: 'Rack A-05',
    dosageForm: 'Syrup',
    strength: '200ml'
  },
  {
    id: 'MED-1018',
    name: 'Ecosprin 75',
    genericName: 'Aspirin 75mg Gastro-Resistant',
    category: 'Cardiac & Hypertension',
    manufacturer: 'USV Pvt Ltd',
    batchNo: 'ECO-6120',
    quantity: 160,
    minStock: 40,
    purchasePrice: 5.50,
    sellingPrice: 10.20,
    expiryDate: '2027-08-30',
    supplier: 'Sun Pharma Distribution',
    prescriptionRequired: true,
    shelfLocation: 'Rack C-01',
    dosageForm: 'Tablet',
    strength: '75mg'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-1042',
    name: 'Rajesh K. Mehta',
    phone: '+91 98210 55432',
    email: 'rajesh.mehta@gmail.com',
    address: 'Flat 402, Sea View Apts, Andheri West, Mumbai',
    totalPurchases: 14850,
    totalVisits: 18,
    lastPurchase: '2026-10-06',
    chronicCondition: 'Type 2 Diabetes'
  },
  {
    id: 'CUST-1043',
    name: 'Pooja Sunita Sharma',
    phone: '+91 98334 11209',
    email: 'pooja.sharma@yahoo.co.in',
    address: 'B-12, Greenfield Enclave, Borivali East, Mumbai',
    totalPurchases: 8940,
    totalVisits: 11,
    lastPurchase: '2026-10-05',
    chronicCondition: 'Hypertension'
  },
  {
    id: 'CUST-1044',
    name: 'Ananya S. Deshmukh',
    phone: '+91 97690 48821',
    email: 'ananya.desh@outlook.com',
    address: '701, Lotus Heights, Kandivali West, Mumbai',
    totalPurchases: 6200,
    totalVisits: 7,
    lastPurchase: '2026-10-04'
  },
  {
    id: 'CUST-1045',
    name: 'Vikramjit Singh',
    phone: '+91 98192 77312',
    email: 'vikram.singh@gmail.com',
    address: 'Plot 88, Guru Nanak Nagar, Malad West, Mumbai',
    totalPurchases: 22400,
    totalVisits: 26,
    lastPurchase: '2026-10-06',
    chronicCondition: 'Cardiac Health'
  },
  {
    id: 'CUST-1046',
    name: 'Deepika Nair',
    phone: '+91 98205 33910',
    email: 'deepika.nair@hotmail.com',
    address: 'Rowhouse 4, Palm Meadows, Goregaon East, Mumbai',
    totalPurchases: 4150,
    totalVisits: 4,
    lastPurchase: '2026-10-02'
  },
  {
    id: 'CUST-1047',
    name: 'Amit Patel',
    phone: '+91 98700 81234',
    email: 'amit.patel99@gmail.com',
    address: 'C-204, Shanti Niketan, Vile Parle West, Mumbai',
    totalPurchases: 11300,
    totalVisits: 14,
    lastPurchase: '2026-10-03',
    chronicCondition: 'Asthma'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-101',
    name: 'MedPlus Wholesale Logistics',
    company: 'MedPlus Healthcare Dist. Pvt Ltd',
    phone: '+91 22 2844 9100',
    email: 'orders@medpluswholesales.in',
    address: 'Bhiwandi Pharma Logistics Park, Gala 102, Thane',
    medicinesSupplied: 340,
    totalPurchases: 540000,
    status: 'Active',
    gstin: '27AABCM8920C1ZA'
  },
  {
    id: 'SUP-102',
    name: 'Sun Pharma Distribution',
    company: 'Sun Healthcare Logistics LLP',
    phone: '+91 22 4589 1234',
    email: 'supply@sunlogistics.com',
    address: 'Marol Industrial Area, Andheri East, Mumbai',
    medicinesSupplied: 215,
    totalPurchases: 385000,
    status: 'Active',
    gstin: '27AALCS4412B1ZY'
  },
  {
    id: 'SUP-103',
    name: 'Cipla Med Distributors',
    company: 'Cipla Regional Supply Center',
    phone: '+91 22 6711 0022',
    email: 'orders.west@cipla.com',
    address: 'MIDC Rabale, Navi Mumbai - 400701',
    medicinesSupplied: 190,
    totalPurchases: 320000,
    status: 'Active',
    gstin: '27AAACC4118D1ZB'
  },
  {
    id: 'SUP-104',
    name: 'Reddys Healthcare Logistics',
    company: 'Dr. Reddy\'s Apex Channel Partner',
    phone: '+91 22 2789 5566',
    email: 'drreddy.dispatch@mumbaidist.in',
    address: 'Sector 19, Vashi, Navi Mumbai',
    medicinesSupplied: 120,
    totalPurchases: 210000,
    status: 'Active',
    gstin: '27AABBD9102K1ZQ'
  },
  {
    id: 'SUP-105',
    name: 'Apex Pharma Hub',
    company: 'Apex Multi-brand Pharma Depot',
    phone: '+91 22 2541 7890',
    email: 'sales@apexpharmahub.in',
    address: 'Wagle Estate, Road No 16, Thane West',
    medicinesSupplied: 85,
    totalPurchases: 145000,
    status: 'Active',
    gstin: '27AABBA3312F1ZZ'
  }
];

export const INITIAL_PURCHASES: PurchaseOrder[] = [
  {
    id: 'PO-2026-089',
    supplierId: 'SUP-101',
    supplierName: 'MedPlus Wholesale Logistics',
    orderDate: '2026-10-04',
    deliveryDate: '2026-10-07',
    itemsCount: 6,
    totalAmount: 48500,
    status: 'Pending',
    items: [
      { medicineName: 'Dolo 650', quantity: 300, unitPrice: 22.50, total: 6750 },
      { medicineName: 'Pan 40', quantity: 200, unitPrice: 105.00, total: 21000 },
      { medicineName: 'Combiflam', quantity: 150, unitPrice: 33.00, total: 4950 },
      { medicineName: 'Betadine Ointment', quantity: 50, unitPrice: 85.00, total: 4250 },
      { medicineName: 'Ascoril D Plus', quantity: 70, unitPrice: 88.00, total: 6160 },
      { medicineName: 'Shelcal 500', quantity: 60, unitPrice: 90.00, total: 5390 }
    ]
  },
  {
    id: 'PO-2026-088',
    supplierId: 'SUP-103',
    supplierName: 'Cipla Med Distributors',
    orderDate: '2026-09-28',
    deliveryDate: '2026-10-02',
    itemsCount: 4,
    totalAmount: 62400,
    status: 'Received',
    items: [
      { medicineName: 'Augmentin 625 Duo', quantity: 200, unitPrice: 154.00, total: 30800 },
      { medicineName: 'Montair LC', quantity: 150, unitPrice: 140.00, total: 21000 },
      { medicineName: 'Azithral 500', quantity: 100, unitPrice: 92.00, total: 9200 },
      { medicineName: 'Clavam 625', quantity: 10, unitPrice: 140.00, total: 1400 }
    ]
  },
  {
    id: 'PO-2026-087',
    supplierId: 'SUP-102',
    supplierName: 'Sun Pharma Distribution',
    orderDate: '2026-09-22',
    deliveryDate: '2026-09-25',
    itemsCount: 5,
    totalAmount: 39800,
    status: 'Received',
    items: [
      { medicineName: 'Glycomet 500 SR', quantity: 250, unitPrice: 32.00, total: 8000 },
      { medicineName: 'Atorva 10', quantity: 180, unitPrice: 78.00, total: 14040 },
      { medicineName: 'Ecosprin 75', quantity: 500, unitPrice: 5.50, total: 2750 },
      { medicineName: 'Volini Spray', quantity: 80, unitPrice: 110.00, total: 8800 },
      { medicineName: 'Telma 40', quantity: 37, unitPrice: 168.00, total: 6210 }
    ]
  },
  {
    id: 'PO-2026-086',
    supplierId: 'SUP-104',
    supplierName: 'Reddys Healthcare Logistics',
    orderDate: '2026-09-15',
    itemsCount: 3,
    totalAmount: 18200,
    status: 'Cancelled',
    items: [
      { medicineName: 'Cetzine 10', quantity: 200, unitPrice: 14.50, total: 2900 },
      { medicineName: 'Omez 20', quantity: 100, unitPrice: 65.00, total: 6500 },
      { medicineName: 'Telma 40', quantity: 50, unitPrice: 176.00, total: 8800 }
    ]
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX-9941',
    customerName: 'Rajesh K. Mehta',
    customerPhone: '+91 98210 55432',
    doctorName: 'Dr. Anand K. Joshi',
    doctorRegistration: 'MCI-2012-08819',
    hospital: 'Kokilaben Dhirubhai Ambani Hospital, Mumbai',
    date: '2026-10-06',
    status: 'Approved',
    notes: 'Post-consultation follow up for fasting glucose level 148 mg/dL.',
    medicines: [
      { medicineName: 'Glycomet 500 SR', dosage: '1-0-1', duration: '30 days', instructions: 'With breakfast & dinner', quantity: 60 },
      { medicineName: 'Telma 40', dosage: '1-0-0', duration: '30 days', instructions: 'Morning empty stomach', quantity: 30 },
      { medicineName: 'Atorva 10', dosage: '0-0-1', duration: '30 days', instructions: 'Night after dinner', quantity: 30 }
    ]
  },
  {
    id: 'RX-9942',
    customerName: 'Pooja Sunita Sharma',
    customerPhone: '+91 98334 11209',
    doctorName: 'Dr. Neha Shenoy',
    doctorRegistration: 'MCI-2015-44912',
    hospital: 'Lilavati Hospital & Research Centre, Bandra',
    date: '2026-10-05',
    status: 'Dispensed',
    notes: 'Acute respiratory tract congestion with allergic rhinitis.',
    medicines: [
      { medicineName: 'Augmentin 625 Duo', dosage: '1-0-1', duration: '5 days', instructions: 'After food with water', quantity: 10 },
      { medicineName: 'Montair LC', dosage: '0-0-1', duration: '10 days', instructions: 'At bedtime', quantity: 10 },
      { medicineName: 'Pan 40', dosage: '1-0-0', duration: '5 days', instructions: 'Before breakfast', quantity: 5 }
    ]
  },
  {
    id: 'RX-9943',
    customerName: 'Vikramjit Singh',
    customerPhone: '+91 98192 77312',
    doctorName: 'Dr. Suresh V. Rao',
    doctorRegistration: 'MCI-1998-10294',
    hospital: 'Nanavati Super Speciality Hospital, Vile Parle',
    date: '2026-10-06',
    status: 'Pending',
    notes: 'Routine hypertension maintenance refilling.',
    medicines: [
      { medicineName: 'Telma 40', dosage: '1-0-0', duration: '30 days', instructions: 'Morning before tea', quantity: 30 },
      { medicineName: 'Ecosprin 75', dosage: '0-1-0', duration: '30 days', instructions: 'After lunch', quantity: 30 }
    ]
  },
  {
    id: 'RX-9944',
    customerName: 'Amit Patel',
    customerPhone: '+91 98700 81234',
    doctorName: 'Dr. Farhan Merchant',
    doctorRegistration: 'MCI-2018-77124',
    hospital: 'Fortis Hiranandani Hospital, Vashi',
    date: '2026-10-04',
    status: 'Approved',
    notes: 'Seasonal bronchial hypersensitivity.',
    medicines: [
      { medicineName: 'Ascoril D Plus Syrup', dosage: '2 tsp', duration: '7 days', instructions: 'Thrice daily after meals', quantity: 1 },
      { medicineName: 'Cetzine 10', dosage: '0-0-1', duration: '5 days', instructions: 'Night bedtime', quantity: 5 }
    ]
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'INV-2026-1048',
    date: '2026-10-06T11:45:00',
    customerName: 'Rajesh K. Mehta',
    customerPhone: '+91 98210 55432',
    items: [
      { medicineId: 'MED-1003', medicineName: 'Glycomet 500 SR', quantity: 2, unitPrice: 48.00, total: 96.00, batchNo: 'GLY-4102' },
      { medicineId: 'MED-1004', medicineName: 'Telma 40', quantity: 1, unitPrice: 225.00, total: 225.00, batchNo: 'TLM-7731' },
      { medicineId: 'MED-1001', medicineName: 'Dolo 650', quantity: 2, unitPrice: 33.60, total: 67.20, batchNo: 'BT-9428' }
    ],
    subtotal: 388.20,
    discount: 19.40,
    tax: 44.25,
    totalAmount: 413.05,
    paymentMethod: 'UPI',
    status: 'Completed'
  },
  {
    id: 'INV-2026-1047',
    date: '2026-10-06T10:15:00',
    customerName: 'Pooja Sunita Sharma',
    customerPhone: '+91 98334 11209',
    items: [
      { medicineId: 'MED-1002', medicineName: 'Augmentin 625 Duo', quantity: 1, unitPrice: 204.50, total: 204.50, batchNo: 'AUG-8812' },
      { medicineId: 'MED-1007', medicineName: 'Montair LC', quantity: 1, unitPrice: 198.00, total: 198.00, batchNo: 'MLC-1204' },
      { medicineId: 'MED-1005', medicineName: 'Pan 40', quantity: 1, unitPrice: 155.00, total: 155.00, batchNo: 'PAN-3301' }
    ],
    subtotal: 557.50,
    discount: 27.88,
    tax: 63.55,
    totalAmount: 593.17,
    paymentMethod: 'Card',
    status: 'Completed'
  },
  {
    id: 'INV-2026-1046',
    date: '2026-10-06T09:30:00',
    customerName: 'Walk-in Customer',
    customerPhone: '+91 99000 00000',
    items: [
      { medicineId: 'MED-1010', medicineName: 'Shelcal 500', quantity: 2, unitPrice: 139.00, total: 278.00, batchNo: 'SHL-6610' },
      { medicineId: 'MED-1011', medicineName: 'Becosules Z', quantity: 3, unitPrice: 56.50, total: 169.50, batchNo: 'BCS-2091' }
    ],
    subtotal: 447.50,
    discount: 0,
    tax: 53.70,
    totalAmount: 501.20,
    paymentMethod: 'Cash',
    status: 'Completed'
  },
  {
    id: 'INV-2026-1045',
    date: '2026-10-05T18:40:00',
    customerName: 'Vikramjit Singh',
    customerPhone: '+91 98192 77312',
    items: [
      { medicineId: 'MED-1008', medicineName: 'Atorva 10', quantity: 3, unitPrice: 112.00, total: 336.00, batchNo: 'ATV-5561' },
      { medicineId: 'MED-1018', medicineName: 'Ecosprin 75', quantity: 5, unitPrice: 10.20, total: 51.00, batchNo: 'ECO-6120' }
    ],
    subtotal: 387.00,
    discount: 19.35,
    tax: 44.12,
    totalAmount: 411.77,
    paymentMethod: 'UPI',
    status: 'Completed'
  },
  {
    id: 'INV-2026-1044',
    date: '2026-10-05T16:10:00',
    customerName: 'Ananya S. Deshmukh',
    customerPhone: '+91 97690 48821',
    items: [
      { medicineId: 'MED-1015', medicineName: 'Betadine 10% Ointment', quantity: 2, unitPrice: 124.00, total: 248.00, batchNo: 'BET-5419' },
      { medicineId: 'MED-1013', medicineName: 'Combiflam', quantity: 2, unitPrice: 49.50, total: 99.00, batchNo: 'CMB-7712' }
    ],
    subtotal: 347.00,
    discount: 0,
    tax: 41.64,
    totalAmount: 388.64,
    paymentMethod: 'Cash',
    status: 'Completed'
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'ACT-1',
    title: 'POS Sale Completed',
    description: 'Invoice #INV-2026-1048 generated for Rajesh K. Mehta (₹413.05 via UPI)',
    timestamp: '15 mins ago',
    type: 'sale'
  },
  {
    id: 'ACT-2',
    title: 'Prescription Verified',
    description: 'Dr. Anand K. Joshi Rx-9941 approved for dispensing',
    timestamp: '42 mins ago',
    type: 'prescription'
  },
  {
    id: 'ACT-3',
    title: 'Critical Low Stock Triggered',
    description: 'Azithral 500 reached 8 strips (Min threshold 20)',
    timestamp: '1 hour ago',
    type: 'alert'
  },
  {
    id: 'ACT-4',
    title: 'Purchase Order Drafted',
    description: 'Order PO-2026-089 created for MedPlus Wholesale (₹48,500)',
    timestamp: '3 hours ago',
    type: 'purchase'
  },
  {
    id: 'ACT-5',
    title: 'Stock Shipment Inwarded',
    description: 'PO-2026-088 verified: 560 units added to Racks B & D',
    timestamp: 'Yesterday at 4:30 PM',
    type: 'inventory'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-1',
    title: 'Low Stock Alert: Azithral 500',
    message: 'Stock is currently at 8 units, below safety threshold (20 units).',
    type: 'warning',
    time: '25 mins ago',
    read: false,
    targetPage: 'lowstock'
  },
  {
    id: 'NOTIF-2',
    title: 'Expiry Notice: Glycomet 500 SR',
    message: 'Batch GLY-4102 (12 units) expires on 25 Oct 2026 (19 days remaining).',
    type: 'danger',
    time: '1 hour ago',
    read: false,
    targetPage: 'expiry'
  },
  {
    id: 'NOTIF-3',
    title: 'New Digital Prescription',
    message: 'Dr. Suresh V. Rao submitted Rx #RX-9943 for Vikramjit Singh.',
    type: 'info',
    time: '2 hours ago',
    read: false,
    targetPage: 'prescriptions'
  },
  {
    id: 'NOTIF-4',
    title: 'Pending Purchase Order',
    message: 'PO #PO-2026-089 awaiting delivery confirmation from MedPlus.',
    type: 'info',
    time: '3 hours ago',
    read: true,
    targetPage: 'purchases'
  }
];

// Analytical Chart Datasets
export const WEEKLY_SALES_DATA = [
  { day: 'Mon', sales: 42300, orders: 114, profit: 9750 },
  { day: 'Tue', sales: 38900, orders: 102, profit: 8940 },
  { day: 'Wed', sales: 46200, orders: 121, profit: 10600 },
  { day: 'Thu', sales: 44100, orders: 118, profit: 10150 },
  { day: 'Fri', sales: 51200, orders: 135, profit: 12200 },
  { day: 'Sat', sales: 58400, orders: 152, profit: 14100 },
  { day: 'Sun (Today)', sales: 48650, orders: 126, profit: 11840 }
];

export const MONTHLY_REVENUE_DATA = [
  { month: 'May', revenue: 980000, purchases: 680000, profit: 300000 },
  { month: 'Jun', revenue: 1040000, purchases: 720000, profit: 320000 },
  { month: 'Jul', revenue: 1120000, purchases: 780000, profit: 340000 },
  { month: 'Aug', revenue: 1090000, purchases: 750000, profit: 340000 },
  { month: 'Sep', revenue: 1230000, purchases: 840000, profit: 390000 },
  { month: 'Oct (Proj.)', revenue: 1310000, purchases: 890000, profit: 420000 }
];

export const INVENTORY_STATUS_DATA = [
  { name: 'Optimal Stock', value: 890, color: '#10b981' },
  { name: 'Low Stock (<Min)', value: 18, color: '#f59e0b' },
  { name: 'Critical / Zero', value: 4, color: '#ef4444' },
  { name: 'Expiring Soon', value: 12, color: '#f97316' }
];

export const CATEGORY_SALES_DISTRIBUTION = [
  { name: 'Analgesics', value: 24, fill: '#3b82f6' },
  { name: 'Antibiotics', value: 28, fill: '#10b981' },
  { name: 'Cardiac & BP', value: 18, fill: '#6366f1' },
  { name: 'Antidiabetic', value: 15, fill: '#f59e0b' },
  { name: 'Gastro / OTC', value: 15, fill: '#14b8a6' }
];

export const TOP_SELLING_MEDICINES = [
  { rank: 1, name: 'Dolo 650', generic: 'Paracetamol', unitsSold: 1420, revenue: 47712, growth: '+14%' },
  { rank: 2, name: 'Pan 40', generic: 'Pantoprazole', unitsSold: 890, revenue: 137950, growth: '+9%' },
  { rank: 3, name: 'Augmentin 625 Duo', generic: 'Amoxicillin+Clav', unitsSold: 640, revenue: 130880, growth: '+22%' },
  { rank: 4, name: 'Combiflam', generic: 'Ibuprofen+Para', unitsSold: 610, revenue: 30195, growth: '+5%' },
  { rank: 5, name: 'Shelcal 500', generic: 'Calcium + Vit D3', unitsSold: 530, revenue: 73670, growth: '+11%' }
];
