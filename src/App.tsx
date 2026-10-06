/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PharmacyProvider, usePharmacy } from './context/PharmacyContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/Toast';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { MedicinesView } from './components/medicines/MedicinesView';
import { InventoryView } from './components/inventory/InventoryView';
import { PosView } from './components/pos/PosView';
import { PurchasesView } from './components/purchases/PurchasesView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { CustomersView } from './components/customers/CustomersView';
import { PrescriptionsView } from './components/prescriptions/PrescriptionsView';
import { LowStockView } from './components/lowstock/LowStockView';
import { ExpiryAlertsView } from './components/expiry/ExpiryAlertsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { activePage } = usePharmacy();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'medicines':
        return <MedicinesView />;
      case 'inventory':
        return <InventoryView />;
      case 'pos':
        return <PosView />;
      case 'purchases':
        return <PurchasesView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'customers':
        return <CustomersView />;
      case 'prescriptions':
        return <PrescriptionsView />;
      case 'lowstock':
        return <LowStockView />;
      case 'expiry':
        return <ExpiryAlertsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header setMobileOpen={setMobileSidebarOpen} />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-slate-50/70">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Floating System Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <PharmacyProvider>
      <MainLayout />
    </PharmacyProvider>
  );
}
