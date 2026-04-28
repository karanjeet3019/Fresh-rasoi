import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  User, 
  Edit, 
  Trash2, 
  Pause, 
  Play, 
  Ban, 
  ArrowLeft,
  MessageSquare,
  History,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Customer, PaymentRecord, Status, PaymentStatus } from '../types';
import { updateCustomer, deleteCustomer, addPayment } from '../lib/storage';
import { View } from '../App';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerDetailsProps {
  customer: Customer;
  onNavigate: (view: View, id?: string) => void;
  refreshData: () => void;
}

export default function CustomerDetails({ customer, onNavigate, refreshData }: CustomerDetailsProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: customer.monthlyPrice,
    method: customer.paymentMethod,
    notes: ''
  });

  const getPaymentStatus = (c: Customer): PaymentStatus => {
    const today = new Date();
    const dueDate = new Date(c.nextPaymentDueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays <= 3) return 'Due Soon';
    return 'Paid';
  };

  const paymentStatus = getPaymentStatus(customer);

  const handleUpdateStatus = (newStatus: Status) => {
    updateCustomer(customer.id, { status: newStatus });
    refreshData();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      deleteCustomer(customer.id);
      refreshData();
      onNavigate('customers');
    }
  };

  const handleMarkPaid = () => {
    addPayment(customer.id, paymentData);
    setShowPaymentModal(false);
    refreshData();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onNavigate('customers')}
          className="btn-ghost flex items-center gap-2 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>
        <div className="flex gap-2">
           <button 
            onClick={() => onNavigate('edit-customer', customer.id)}
            className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-xl text-slate-600 hover:text-brand-green transition-all"
          >
            <Edit size={20} />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-xl text-slate-600 hover:text-rose-600 transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card text-center !p-8 border-b-4 border-b-brand-green">
            <div className="w-24 h-24 bg-brand-light-green rounded-3xl flex items-center justify-center text-brand-green font-bold text-4xl mx-auto mb-4 border-4 border-brand-green/10">
              {customer.name.charAt(0)}
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{customer.name}</h3>
            <p className="text-slate-500 font-medium mb-6">{customer.area}</p>
            
            <div className="grid grid-cols-2 gap-2 mb-8">
               <div className={`py-2 rounded-xl text-xs font-bold ${customer.status === 'Active' ? 'status-active' : customer.status === 'Paused' ? 'status-paused' : 'status-cancelled'}`}>
                 {customer.status}
               </div>
               <div className={`py-2 rounded-xl text-xs font-bold ${paymentStatus === 'Paid' ? 'pay-paid' : paymentStatus === 'Due Soon' ? 'pay-soon' : paymentStatus === 'Due Today' ? 'pay-today' : 'pay-overdue'}`}>
                 {paymentStatus}
               </div>
            </div>

            <div className="flex flex-col gap-2">
              <a 
                href={`tel:${customer.phoneNumber}`}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Phone size={18} /> Call Customer
              </a>
              <a 
                href={`https://wa.me/${customer.phoneNumber}?text=${encodeURIComponent(`Hi ${customer.name}, this is FRESH RASOI. Your monthly tiffin payment is due. Amount: $${customer.monthlyPrice}. Thank you.`)}`}
                target="_blank"
                className="btn-primary !bg-green-600 w-full flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} /> WhatsApp
              </a>
            </div>
          </div>

          <div className="card space-y-4">
             <h4 className="font-bold flex items-center gap-2 text-slate-800"><MapPin size={18} /> Contact & Location</h4>
             <div className="space-y-4">
                <div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone Number</span>
                   <p className="text-slate-800 font-semibold">{customer.phoneNumber}</p>
                </div>
                <div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Area</span>
                   <p className="text-slate-800 font-semibold">{customer.area}</p>
                </div>
                <div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Address</span>
                   <p className="text-slate-800 font-medium text-sm leading-relaxed">{customer.address}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Tiffin & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="card bg-white border-l-4 border-l-brand-green">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-brand-light-green text-brand-green rounded-lg"><Calendar size={20} /></div>
                   <h4 className="font-bold">Subscription</h4>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">Start Date</span>
                      <span className="text-sm font-bold text-slate-800">{customer.startDate}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">Monthly Price</span>
                      <span className="text-sm font-bold text-slate-800">${customer.monthlyPrice}</span>
                   </div>
                </div>
             </div>
             
             <div className="card bg-white border-l-4 border-l-brand-orange">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-orange-50 text-brand-orange rounded-lg"><CreditCard size={20} /></div>
                   <h4 className="font-bold">Last Payment</h4>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">Last Paid</span>
                      <span className="text-sm font-bold text-slate-800">{customer.lastPaymentDate}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">Next Due</span>
                      <span className="text-sm font-bold text-slate-800">{customer.nextPaymentDueDate}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Delivery & Food Details */}
          <div className="card">
             <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                   <User size={20} className="text-brand-green" /> Tiffin Details
                </h4>
                <div className="flex flex-wrap gap-1">
                   {customer.deliveryDays.map(day => (
                      <span key={day} className="px-2 py-0.5 bg-brand-light-green text-brand-green text-[10px] font-bold rounded uppercase tracking-wider">{day.substring(0, 3)}</span>
                   ))}
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl font-bold text-brand-orange shadow-sm">{customer.foodDetails.rotiCount}</div>
                      <div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rotis per Day</p>
                         <p className="font-bold text-slate-800">Fresh Whole Wheat</p>
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Daily Inclusions</span>
                      <div className="flex flex-wrap gap-2">
                        {customer.foodDetails.dryVeg.include && <span className="px-3 py-1 bg-brand-green/10 text-brand-green text-xs font-bold rounded-lg border border-brand-green/10">Dry Veg ({customer.foodDetails.dryVeg.size})</span>}
                        {customer.foodDetails.liquidVeg.include && <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">Liquid Veg ({customer.foodDetails.liquidVeg.size})</span>}
                        {customer.foodDetails.salad.include && <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg border border-green-100">Salad ({customer.foodDetails.salad.size})</span>}
                        {customer.foodDetails.rice.include && <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-lg border border-amber-100">Rice ({customer.foodDetails.rice.size})</span>}
                        {customer.foodDetails.dahi.include && <span className="px-3 py-1 bg-sky-50 text-sky-600 text-xs font-bold rounded-lg border border-sky-100">Dahi ({customer.foodDetails.dahi.size})</span>}
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center text-xs">
                         <span className="font-bold text-slate-400 uppercase">Spice Level</span>
                         <span className="font-bold text-brand-orange">{customer.foodDetails.spiceLevel}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                         <span className="font-bold text-slate-400 uppercase">Oil Level</span>
                         <span className="font-bold text-brand-green">{customer.foodDetails.oilLevel}</span>
                      </div>
                      {customer.foodDetails.preferences && (
                        <div className="pt-2 border-t border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Preferences</span>
                          <p className="text-sm text-slate-700 font-medium">{customer.foodDetails.preferences}</p>
                        </div>
                      )}
                       {customer.foodDetails.specialInstructions && (
                        <div className="pt-2 border-t border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Instructions</span>
                          <p className="text-sm text-slate-700 font-medium italic">"{customer.foodDetails.specialInstructions}"</p>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>

          {/* Payment Actions & History */}
          <div className="card space-y-6">
             <div className="flex items-center justify-between">
                <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                   <History size={20} className="text-slate-400" /> Payment History
                </h4>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="btn-primary text-xs flex items-center gap-2"
                >
                  <Plus size={16} /> Mark as Paid
                </button>
             </div>

             <div className="space-y-3">
               {customer.paymentHistory.length > 0 ? (
                 [...customer.paymentHistory].reverse().map(payment => (
                   <div key={payment.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-green-600 shadow-sm">
                            <CheckCircle2 size={18} />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-800">${payment.amount} <span className="text-[10px] font-bold text-slate-400 uppercase ml-2">via {payment.method}</span></p>
                            <p className="text-xs text-slate-500 font-medium">{payment.date} {payment.notes && `• ${payment.notes}`}</p>
                         </div>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="py-8 text-center text-slate-400 text-sm">No payment history available.</div>
               )}
             </div>
          </div>

          {/* Status Controls */}
          <div className="flex flex-wrap gap-3">
            {customer.status !== 'Active' && (
              <button onClick={() => handleUpdateStatus('Active')} className="flex-1 btn-secondary flex items-center justify-center gap-2">
                <Plus size={18} /> Activate Member
              </button>
            )}
            {customer.status === 'Active' && (
              <button onClick={() => handleUpdateStatus('Paused')} className="flex-1 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                <Pause size={18} /> Pause Subscription
              </button>
            )}
            {customer.status !== 'Cancelled' && (
              <button onClick={() => handleUpdateStatus('Cancelled')} className="flex-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                <Ban size={18} /> Cancel Subscription
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowPaymentModal(false)}
               className="absolute inset-0 bg-brand-deep-green/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/5 -mr-8 -mt-8 rounded-full" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Record Payment</h3>
                <p className="text-slate-500 text-sm mb-6">Updating payment for {customer.name}</p>
                
                <div className="space-y-5">
                   <div>
                      <label className="label uppercase text-[10px] tracking-widest text-slate-400">Amount Paid ($)</label>
                      <input 
                        type="number" 
                        className="input-field"
                        value={paymentData.amount}
                        onChange={e => setPaymentData({ ...paymentData, amount: Number(e.target.value) })}
                      />
                   </div>
                    <div>
                      <label className="label uppercase text-[10px] tracking-widest text-slate-400">Payment Method</label>
                      <select 
                        className="input-field"
                        value={paymentData.method}
                        onChange={e => setPaymentData({ ...paymentData, method: e.target.value })}
                      >
                         <option value="Cash">Cash</option>
                         <option value="E-transfer">E-transfer</option>
                         <option value="Card">Card</option>
                         <option value="Other">Other</option>
                      </select>
                   </div>
                    <div>
                      <label className="label uppercase text-[10px] tracking-widest text-slate-400">Optional Notes</label>
                      <input 
                        type="text" 
                        className="input-field"
                        placeholder="e.g. Paid for next month too"
                        value={paymentData.notes}
                        onChange={e => setPaymentData({ ...paymentData, notes: e.target.value })}
                      />
                   </div>
                   
                   <div className="flex gap-3 pt-4">
                      <button onClick={() => setShowPaymentModal(false)} className="flex-1 btn-ghost">Cancel</button>
                      <button onClick={handleMarkPaid} className="flex-1 btn-secondary">Record Payment</button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
