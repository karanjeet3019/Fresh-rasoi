import React from 'react';
import { 
  Users, 
  CreditCard, 
  AlertCircle, 
  TrendingUp,
  ChevronRight,
  Utensils
} from 'lucide-react';
import { Customer, DAYS, PaymentStatus } from '../types';
import { View } from '../App';

interface DashboardProps {
  customers: Customer[];
  onNavigate: (view: View, customerId?: string) => void;
}

export default function Dashboard({ customers, onNavigate }: DashboardProps) {
  const activeCustomers = customers.filter(c => c.status === 'Active');
  
  const getPaymentStatus = (customer: Customer): PaymentStatus => {
    const today = new Date();
    const dueDate = new Date(customer.nextPaymentDueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays <= 3) return 'Due Soon';
    return 'Paid';
  };

  const stats = {
    totalActive: activeCustomers.length,
    dueToday: activeCustomers.filter(c => getPaymentStatus(c) === 'Due Today').length,
    dueSoon: activeCustomers.filter(c => getPaymentStatus(c) === 'Due Soon').length,
    overdue: activeCustomers.filter(c => getPaymentStatus(c) === 'Overdue').length,
    estimatedMonthly: activeCustomers.reduce((acc, curr) => acc + curr.monthlyPrice, 0)
  };

  const getDayTotals = (day: string) => {
    const dayCustomers = activeCustomers.filter(c => c.deliveryDays.includes(day as any));
    
    // Group by roti count
    const rotiBreakdown: Record<number, number> = {};
    dayCustomers.forEach(c => {
      const count = c.foodDetails.rotiCount;
      rotiBreakdown[count] = (rotiBreakdown[count] || 0) + 1;
    });

    return {
      tiffins: dayCustomers.length,
      rotis: dayCustomers.reduce((acc, curr) => acc + curr.foodDetails.rotiCount, 0),
      rotiBreakdown
    };
  };

  const dayStats = DAYS.map(day => ({
    name: day,
    ...getDayTotals(day)
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-display text-brand-deep-green mb-1">Welcome back, Admin</h2>
        <p className="text-slate-500">Here's what's happening today at FRESH RASOI.</p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Active Customers', value: stats.totalActive, icon: Users, color: 'bg-blue-50 text-blue-600', view: 'customers' },
          { label: 'Due Today', value: stats.dueToday, icon: Utensils, color: 'bg-blue-50 text-blue-600', view: 'payments' },
          { label: 'Due Soon', value: stats.dueSoon, icon: AlertCircle, color: 'bg-orange-50 text-brand-orange', view: 'payments' },
          { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'bg-red-50 text-red-600', view: 'payments' },
          { label: 'Est. Monthly Income', value: `$${stats.estimatedMonthly.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-50 text-brand-green', view: 'dashboard' },
        ].map((stat, i) => (
          <button 
            key={i} 
            onClick={() => onNavigate(stat.view as View)}
            className="card flex flex-col items-start gap-3 text-left group"
          >
            <div className={`p-2 rounded-lg ${stat.color} transition-transform group-hover:scale-110`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tiffins per Day */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold font-display text-brand-deep-green flex items-center gap-2">
            <Utensils size={20} className="text-brand-green" />
            Total Tiffins per Day
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {dayStats.map((day) => (
              <div key={day.name} className="card p-3 flex flex-col justify-between h-24 border-l-4 border-l-brand-green">
                <span className="text-xs font-bold text-slate-400 uppercase">{day.name}</span>
                <span className="text-2xl font-bold text-brand-green">{day.tiffins}</span>
                <span className="text-xs text-slate-500 font-medium">Tiffins</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rotis per Day */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold font-display text-brand-deep-green flex items-center gap-2">
            <ChefHat size={20} className="text-brand-orange" />
            Total Rotis Needed
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {dayStats.map((day) => (
              <div key={day.name} className="card p-3 flex flex-col border-l-4 border-l-brand-orange">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">{day.name}</span>
                  <span className="text-xl font-bold text-brand-orange">{day.rotis}</span>
                </div>
                <div className="space-y-1 overflow-y-auto max-h-24 pr-1">
                  {Object.entries(day.rotiBreakdown).sort((a,b) => Number(a[0]) - Number(b[0])).map(([count, tiffins]) => (
                    <div key={count} className="text-[10px] font-bold text-slate-500 bg-orange-50 px-2 py-1 rounded flex justify-between">
                      <span>{tiffins} packs</span>
                      <span>of {count}</span>
                    </div>
                  ))}
                  {Object.keys(day.rotiBreakdown).length === 0 && (
                    <span className="text-[10px] text-slate-300 italic">No rotis</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reminders Section */}
      {(stats.dueToday > 0 || stats.overdue > 0) && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold font-display text-brand-deep-green">Urgent Payment Reminders</h3>
          <div className="space-y-3">
            {activeCustomers
              .filter(c => ['Due Today', 'Overdue'].includes(getPaymentStatus(c)))
              .map(c => (
                <div key={c.id} className="card flex items-center justify-between group border-l-4 border-l-red-500">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getPaymentStatus(c) === 'Overdue' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{c.name}</p>
                      <p className={`text-sm font-medium ${getPaymentStatus(c) === 'Overdue' ? 'text-red-500' : 'text-blue-500'}`}>
                        {getPaymentStatus(c)} • Due Date: {c.nextPaymentDueDate}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate('customer-details', c.id)}
                    className="p-2 text-slate-400 hover:text-brand-green hover:bg-slate-50 rounded-lg transition-all"
                  >
                    <ChevronRight />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ChefHat Import for Dashboard
import { ChefHat } from 'lucide-react';
