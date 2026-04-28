import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Phone, 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  MessageSquare,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Customer, DayOfWeek, PaymentStatus, Status } from '../types';
import { View } from '../App';

interface CustomersPageProps {
  customers: Customer[];
  onNavigate: (view: View, id?: string) => void;
  refreshData: () => void;
}

export default function CustomersPage({ customers, onNavigate }: CustomersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'All'>('All');
  const [dayFilter, setDayFilter] = useState<DayOfWeek | 'All'>('All');

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

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phoneNumber.includes(searchTerm) ||
        c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.area.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesPayment = paymentFilter === 'All' || getPaymentStatus(c) === paymentFilter;
      const matchesDay = dayFilter === 'All' || c.deliveryDays.includes(dayFilter as DayOfWeek);

      return matchesSearch && matchesStatus && matchesPayment && matchesDay;
    });
  }, [customers, searchTerm, statusFilter, paymentFilter, dayFilter]);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Paused': return 'status-paused';
      case 'Cancelled': return 'status-cancelled';
    }
  };

  const getPaymentColor = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid': return 'pay-paid';
      case 'Due Soon': return 'pay-soon';
      case 'Due Today': return 'pay-today';
      case 'Overdue': return 'pay-overdue';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-brand-deep-green mb-1">Customers</h2>
          <p className="text-slate-500">Managing {customers.length} tiffin subscriptions.</p>
        </div>
        <button 
          onClick={() => onNavigate('add-customer')}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, phone, area or address..." 
            className="input-field pl-12 py-3 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select 
            className="input-field w-auto min-w-[140px] appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Paused">Paused Only</option>
            <option value="Cancelled">Cancelled Only</option>
          </select>

          <select 
            className="input-field w-auto min-w-[140px] appearance-none"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as any)}
          >
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Due Soon">Due Soon</option>
            <option value="Due Today">Due Today</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select 
            className="input-field w-auto min-w-[140px] appearance-none"
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value as any)}
          >
            <option value="All">Any Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </select>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => {
            const paymentStatus = getPaymentStatus(customer);
            return (
              <div 
                key={customer.id} 
                className="card flex flex-col justify-between group h-full border-b-4 hover:border-b-brand-green"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-light-green flex items-center justify-center text-brand-green font-bold text-lg">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        {customer.name}
                        <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </h4>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                        <Phone size={12} className="text-slate-400" />
                        {customer.phoneNumber}
                      </p>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-slate-300" />
                        {customer.area}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentColor(paymentStatus)}`}>
                    {paymentStatus}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-semibold text-slate-400 border-b border-slate-50 pb-1">
                    <span>MONTHLY PRICE</span>
                    <span className="text-slate-800">${customer.monthlyPrice}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400 border-b border-slate-50 pb-1">
                    <span>NEXT DUE</span>
                    <span className={paymentStatus === 'Overdue' ? 'text-red-500' : 'text-slate-800'}>
                      {customer.nextPaymentDueDate}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {customer.deliveryDays.map(day => (
                      <span key={day} className="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">
                        {day.substring(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 border-t border-slate-50 pt-4">
                  <button 
                    onClick={() => onNavigate('customer-details', customer.id)}
                    className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2"
                  >
                    Details <ChevronRight size={16} />
                  </button>
                  <a 
                    href={`tel:${customer.phoneNumber}`}
                    className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <Phone size={20} />
                  </a>
                  <a 
                    href={`https://wa.me/${customer.phoneNumber}?text=${encodeURIComponent(`Hi ${customer.name}, this is FRESH RASOI. Your monthly tiffin payment is due. Amount: $${customer.monthlyPrice}. Thank you.`)}`}
                    target="_blank"
                    className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <MessageSquare size={20} />
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
            <Search size={48} className="opacity-20" />
            <p className="font-medium">No customers found matching your criteria</p>
            <button onClick={() => {setSearchTerm(''); setStatusFilter('All'); setPaymentFilter('All'); setDayFilter('All');}} className="text-brand-green font-bold text-sm">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
