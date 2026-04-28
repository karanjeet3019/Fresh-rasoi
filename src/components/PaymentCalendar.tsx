import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Phone,
  Clock
} from 'lucide-react';
import { Customer, PaymentStatus } from '../types';
import { View } from '../App';

interface PaymentCalendarProps {
  customers: Customer[];
  onNavigate: (view: View, id?: string) => void;
}

export default function PaymentCalendar({ customers, onNavigate }: PaymentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const getPaymentStatus = (customer: Customer, dateStr: string): PaymentStatus => {
    const targetDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(customer.nextPaymentDueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays <= 3) return 'Due Soon';
    return 'Paid';
  };

  const getCustomersOnDate = (day: number) => {
    const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return customers.filter(c => c.nextPaymentDueDate === dateStr && c.status !== 'Cancelled');
  };

  const calendarDays = [];
  const totalDays = daysInMonth(year, currentDate.getMonth());
  const offset = firstDayOfMonth(year, currentDate.getMonth());

  // Fill offset days
  for (let i = 0; i < offset; i++) calendarDays.push(null);
  // Fill actual days
  for (let i = 1; i <= totalDays; i++) calendarDays.push(i);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid': return 'bg-green-500';
      case 'Due Soon': return 'bg-orange-500';
      case 'Due Today': return 'bg-blue-500';
      case 'Overdue': return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-brand-deep-green mb-1">Payment Calendar</h2>
          <p className="text-slate-500">Track monthly renewal dates for all customers.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
           <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><ChevronLeft size={20} /></button>
           <span className="px-4 font-bold text-slate-700 min-w-[140px] text-center">{monthName} {year}</span>
           <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="card !p-0 overflow-hidden shadow-xl border-none">
        <div className="grid grid-cols-7 bg-brand-green text-white font-bold text-center py-4">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <div key={d} className="text-xs tracking-widest">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-l border-t border-slate-100">
          {calendarDays.map((day, i) => {
            const dueCustomers = day ? getCustomersOnDate(day) : [];
            const isToday = day && 
              new Date().getDate() === day && 
              new Date().getMonth() === currentDate.getMonth() && 
              new Date().getFullYear() === year;

            return (
              <div 
                key={i} 
                className={`min-h-[120px] bg-white border-r border-b border-slate-100 p-2 relative group hover:bg-slate-50 transition-colors ${day ? '' : 'bg-slate-50/50'}`}
              >
                {day && (
                  <>
                    <span className={`text-sm font-bold ${isToday ? 'w-7 h-7 flex items-center justify-center bg-brand-orange text-white rounded-full' : 'text-slate-400'}`}>
                      {day}
                    </span>
                    <div className="mt-2 space-y-1">
                      {dueCustomers.map(c => {
                        const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const status = getPaymentStatus(c, dateStr);
                        return (
                          <button 
                            key={c.id}
                            onClick={() => onNavigate('customer-details', c.id)}
                            className={`w-full text-left p-1.5 rounded-lg text-white text-[10px] font-bold truncate flex flex-col gap-0.5 ${getStatusColor(status)} shadow-sm active:scale-95 transition-all`}
                          >
                            <span>{c.name}</span>
                            <span className="opacity-80">${c.monthlyPrice}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 pt-4">
         <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="w-3 h-3 rounded-full bg-green-500"></div> Paid
         </div>
         <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div> Due Soon
         </div>
         <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="w-3 h-3 rounded-full bg-red-500"></div> Overdue
         </div>
         <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div> Due Today
         </div>
      </div>
    </div>
  );
}
