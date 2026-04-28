import React, { useMemo } from 'react';
import { 
  CreditCard, 
  Search, 
  MessageSquare, 
  Phone, 
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Customer, PaymentStatus } from '../types';
import { View } from '../App';

interface PaymentsPageProps {
  customers: Customer[];
  onNavigate: (view: View, id?: string) => void;
  refreshData: () => void;
}

export default function PaymentsPage({ customers, onNavigate }: PaymentsPageProps) {
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

  const paymentReminders = useMemo(() => {
    return customers
      .filter(c => c.status !== 'Cancelled')
      .map(c => ({ ...c, currentStatus: getPaymentStatus(c) }))
      .filter(c => c.currentStatus !== 'Paid')
      .sort((a, b) => {
        const order = { 'Overdue': 0, 'Due Today': 1, 'Due Soon': 2 };
        return (order[a.currentStatus] ?? 3) - (order[b.currentStatus] ?? 3);
      });
  }, [customers]);

  const getRemiderStyle = (status: PaymentStatus) => {
    switch (status) {
      case 'Overdue': return 'border-l-red-500 bg-red-50/30';
      case 'Due Today': return 'border-l-blue-500 bg-blue-50/30';
      case 'Due Soon': return 'border-l-orange-500 bg-orange-50/30';
      default: return 'border-l-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-display text-brand-deep-green mb-1">Payments & Reminders</h2>
        <p className="text-slate-500">Track collections and send reminders to customers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Reminders */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold font-display text-brand-deep-green flex items-center gap-2">
            <AlertCircle size={20} className="text-brand-orange" />
            Active Reminders
          </h3>
          
          {paymentReminders.length > 0 ? (
            <div className="space-y-3">
              {paymentReminders.map(c => (
                <div 
                  key={c.id} 
                  className={`card !p-5 border-l-4 transition-all hover:translate-x-1 ${getRemiderStyle(c.currentStatus as PaymentStatus)}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-bold text-slate-700">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{c.name}</h4>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                          <CreditCard size={14} /> ${c.monthlyPrice} due on {c.nextPaymentDueDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <a 
                        href={`https://wa.me/${c.phoneNumber}?text=${encodeURIComponent(`Hi ${c.name}, this is FRESH RASOI. Your monthly tiffin payment is due. Amount: $${c.monthlyPrice}. Thank you.`)}`}
                        target="_blank"
                        className="btn-secondary !bg-green-600 text-xs px-3 py-2 flex items-center gap-2"
                      >
                        <MessageSquare size={16} /> WhatsApp
                      </a>
                      <button 
                         onClick={() => onNavigate('customer-details', c.id)}
                         className="btn-primary text-xs px-3 py-2 flex items-center gap-2"
                      >
                        Mark Paid <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white/50 rounded-xl border border-slate-100 italic text-xs text-slate-500">
                    "Payment due for {c.name}. Their tiffin has completed one month. Call or message them for payment at FRESH RASOI."
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card py-16 flex flex-col items-center justify-center text-slate-400 gap-3 border-dashed border-2">
               <CheckCircle2 size={48} className="text-green-400" />
               <p className="font-bold text-lg text-slate-500">All caught up!</p>
               <p className="text-sm">No pending payments found.</p>
            </div>
          )}
        </div>

        {/* Right Column: Mini Stats/Actions */}
        <div className="space-y-6">
          <div className="card bg-brand-green text-white">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Clock size={18} /> Collection Summary
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl">
                 <span className="text-xs font-semibold opacity-80 uppercase">Overdue Total</span>
                 <span className="text-xl font-black text-red-300">
                   ${paymentReminders.filter(c => c.currentStatus === 'Overdue').reduce((acc, c) => acc + c.monthlyPrice, 0)}
                 </span>
              </div>
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl">
                 <span className="text-xs font-semibold opacity-80 uppercase">Due Today Total</span>
                 <span className="text-xl font-black text-blue-200">
                   ${paymentReminders.filter(c => c.currentStatus === 'Due Today').reduce((acc, c) => acc + c.monthlyPrice, 0)}
                 </span>
              </div>
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl">
                 <span className="text-xs font-semibold opacity-80 uppercase">Due Soon Total</span>
                 <span className="text-xl font-black text-orange-200">
                   ${paymentReminders.filter(c => c.currentStatus === 'Due Soon').reduce((acc, c) => acc + c.monthlyPrice, 0)}
                 </span>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('customers')}
              className="w-full mt-6 py-3 bg-white text-brand-green font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Search size={18} /> View All Customers
            </button>
          </div>

          <div className="card">
             <h4 className="font-bold text-slate-800 mb-4">Quick Help</h4>
             <ul className="space-y-3">
                <li className="text-xs text-slate-500 flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1 shrink-0"></div>
                   Payments are automatically tracked based on the start date or last payment date.
                </li>
                <li className="text-xs text-slate-500 flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1 shrink-0"></div>
                   Use the WhatsApp button to quickly send the due template.
                </li>
                <li className="text-xs text-slate-500 flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1 shrink-0"></div>
                   Payments marked as "Paid" will refresh the next due date to one month from today.
                </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
