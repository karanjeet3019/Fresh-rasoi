/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  ClipboardList, 
  CalendarDays, 
  CreditCard,
  Menu,
  X,
  ChefHat
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Customer, DayOfWeek, PaymentStatus } from './types';
import { getCustomers, saveCustomers } from './lib/storage';

// Pages
import Dashboard from './components/Dashboard';
import CustomersPage from './components/CustomersPage';
import CustomerForm from './components/CustomerForm';
import WeeklySummary from './components/WeeklySummary';
import PaymentCalendar from './components/PaymentCalendar';
import PaymentsPage from './components/PaymentsPage';
import CustomerDetails from './components/CustomerDetails';

export type View = 'dashboard' | 'customers' | 'add-customer' | 'weekly-summary' | 'payment-calendar' | 'payments' | 'customer-details' | 'edit-customer';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setCustomers(getCustomers());
  }, []);

  const refreshData = () => {
    setCustomers(getCustomers());
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'add-customer', label: 'Add Customer', icon: UserPlus },
    { id: 'weekly-summary', label: 'Weekly Summary', icon: ClipboardList },
    { id: 'payment-calendar', label: 'Payment Calendar', icon: CalendarDays },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  const handleNavigate = (view: View, customerId?: string) => {
    setCurrentView(view);
    if (customerId) setSelectedCustomerId(customerId);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const selectedCustomer = useMemo(() => 
    customers.find(c => c.id === selectedCustomerId) || null,
  [customers, selectedCustomerId]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard customers={customers} onNavigate={handleNavigate} />;
      case 'customers':
        return <CustomersPage customers={customers} onNavigate={handleNavigate} refreshData={refreshData} />;
      case 'add-customer':
        return <CustomerForm onCancel={() => setCurrentView('customers')} onSuccess={() => { refreshData(); setCurrentView('customers'); }} />;
      case 'edit-customer':
        return <CustomerForm customer={selectedCustomer} onCancel={() => setCurrentView('customers')} onSuccess={() => { refreshData(); setCurrentView('customers'); }} />;
      case 'weekly-summary':
        return <WeeklySummary customers={customers} />;
      case 'payment-calendar':
        return <PaymentCalendar customers={customers} onNavigate={handleNavigate} />;
      case 'payments':
        return <PaymentsPage customers={customers} onNavigate={handleNavigate} refreshData={refreshData} />;
      case 'customer-details':
        return selectedCustomer ? <CustomerDetails customer={selectedCustomer} onNavigate={handleNavigate} refreshData={refreshData} /> : <div className="p-8">Customer not found</div>;
      default:
        return <Dashboard customers={customers} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-brand-green text-white shadow-xl min-h-screen z-20">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold font-display italic tracking-tight text-white">
            FRESH <span className="text-brand-orange">RASOI</span>
          </h1>
          <p className="text-[10px] opacity-60 mt-1 uppercase tracking-widest font-bold">Tiffin Management</p>
        </div>

        <nav className="flex-1 py-4 space-y-0 text-white/70">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id as View)}
                className={`w-full flex items-center gap-3 px-6 py-4 font-semibold transition-all ${
                  currentView === item.id 
                    ? 'nav-link-active' 
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 bg-black/10">
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Monthly Estimate</p>
          <div className="text-xl font-bold font-display">
            ${customers.filter(c => c.status === 'Active').reduce((acc, c) => acc + c.monthlyPrice, 0).toLocaleString()}
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <header className="md:hidden bg-brand-green p-4 sticky top-0 z-30 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2" onClick={() => handleNavigate('dashboard')}>
          <h1 className="text-lg font-bold font-display text-white tracking-tight italic">
            FRESH <span className="text-brand-orange">RASOI</span>
          </h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-white bg-white/10 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-brand-deep-green/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-brand-green text-white z-50 shadow-2xl p-0 md:hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold font-display italic text-white flex items-center gap-2">
                   FRESH <span className="text-brand-orange">RASOI</span>
                </h1>
              </div>
              <nav className="flex-1 py-4 space-y-0 text-white/70">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id as View)}
                      className={`w-full flex items-center gap-4 px-6 py-5 font-semibold transition-all ${
                        currentView === item.id 
                          ? 'nav-link-active text-lg' 
                          : 'hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={22} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="max-w-6xl mx-auto pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

