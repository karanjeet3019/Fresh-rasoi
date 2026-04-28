import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  DollarSign,
  Utensils,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { 
  Customer, 
  DayOfWeek, 
  DAYS, 
  Status, 
  PAYMENT_METHODS, 
  FoodDetails, 
  ItemSize, 
  SpiceLevel, 
  OilLevel 
} from '../types';
import { addCustomer, updateCustomer } from '../lib/storage';

interface CustomerFormProps {
  customer?: Customer | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const initialFoodDetails: FoodDetails = {
  rotiCount: 4,
  dryVeg: { include: true, size: 'Small', portions: 1 },
  liquidVeg: { include: true, size: 'Small', portions: 1 },
  salad: { include: true, size: 'Small' },
  rice: { include: true, size: 'Small' },
  dahi: { include: true, size: 'Small' },
  preferences: '',
  allergies: '',
  spiceLevel: 'Medium',
  oilLevel: 'Normal oil',
  specialInstructions: ''
};

export default function CustomerForm({ customer, onCancel, onSuccess }: CustomerFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    area: '',
    startDate: new Date().toISOString().split('T')[0],
    monthlyPrice: 150,
    paymentMethod: 'Cash',
    status: 'Active' as Status,
    deliveryDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as DayOfWeek[],
    foodDetails: { ...initialFoodDetails }
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        area: customer.area,
        startDate: customer.startDate,
        monthlyPrice: customer.monthlyPrice,
        paymentMethod: customer.paymentMethod,
        status: customer.status,
        deliveryDays: customer.deliveryDays,
        foodDetails: { ...customer.foodDetails }
      });
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customer) {
      updateCustomer(customer.id, formData);
    } else {
      const today = new Date();
      const nextDue = new Date(formData.startDate);
      nextDue.setMonth(nextDue.getMonth() + 1);
      
      addCustomer({
        ...formData,
        lastPaymentDate: formData.startDate,
        nextPaymentDueDate: nextDue.toISOString().split('T')[0]
      });
    }
    onSuccess();
  };

  const toggleDay = (day: DayOfWeek) => {
    const next = formData.deliveryDays.includes(day)
      ? formData.deliveryDays.filter(d => d !== day)
      : [...formData.deliveryDays, day];
    setFormData({ ...formData, deliveryDays: next });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-display text-brand-deep-green mb-1">
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <p className="text-slate-500">Step {step} of 3: {step === 1 ? 'Personal Details' : step === 2 ? 'Delivery Schedule' : 'Food Preferences'}</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
          <X size={24} />
        </button>
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${step >= s ? 'bg-brand-green' : 'bg-slate-100'}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label uppercase tracking-wider text-[10px] text-slate-400">Customer Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    className="input-field pl-12"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label uppercase tracking-wider text-[10px] text-slate-400">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    required
                    type="tel" 
                    className="input-field pl-12"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="label uppercase tracking-wider text-[10px] text-slate-400">Full Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-4 text-slate-400" />
                  <textarea 
                    required
                    className="input-field pl-12 h-24 pt-3"
                    placeholder="Street, building, apartment number..."
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label uppercase tracking-wider text-[10px] text-slate-400">Area / City</label>
                <input 
                  required
                  type="text" 
                  className="input-field"
                  placeholder="Enter area name"
                  value={formData.area}
                  onChange={e => setFormData({ ...formData, area: e.target.value })}
                />
              </div>
              <div>
                <label className="label uppercase tracking-wider text-[10px] text-slate-400">Start Date</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    required
                    type="date" 
                    className="input-field pl-12"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label uppercase tracking-wider text-[10px] text-slate-400">Monthly Price ($)</label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    required
                    type="number" 
                    className="input-field pl-12"
                    placeholder="150"
                    value={formData.monthlyPrice}
                    onChange={e => setFormData({ ...formData, monthlyPrice: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="label uppercase tracking-wider text-[10px] text-slate-400">Payment Method</label>
                <select 
                  className="input-field"
                  value={formData.paymentMethod}
                  onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="label uppercase tracking-wider text-[10px] text-slate-400">Initial Status</label>
                <select 
                  className="input-field"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as Status })}
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="card border-l-4 border-l-brand-green">
              <h4 className="font-bold text-lg mb-4 text-brand-deep-green flex items-center gap-2">
                <Calendar size={20} className="text-brand-green" />
                Delivery Days
              </h4>
              <p className="text-sm text-slate-500 mb-6 italic">Select the days this customer wants tiffin delivered.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`h-20 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${
                      formData.deliveryDays.includes(day)
                        ? 'border-brand-green bg-brand-light-green text-brand-green shadow-sm'
                        : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">{day.substring(0, 3)}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${formData.deliveryDays.includes(day) ? 'bg-brand-green text-white' : 'bg-slate-100'}`}>
                      {formData.deliveryDays.includes(day) && <X size={14} className="rotate-45" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Roti Section */}
              <div className="card">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Utensils size={18} className="text-brand-orange" />
                  Roti Details
                </h4>
                <div>
                  <label className="label uppercase tracking-widest text-[10px] text-slate-400">Number of Rotis per day</label>
                  <div className="flex items-center gap-4">
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, rotiCount: Math.max(0, formData.foodDetails.rotiCount - 1) } })}
                      className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                    >-</button>
                    <span className="text-xl font-bold w-8 text-center">{formData.foodDetails.rotiCount}</span>
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, rotiCount: formData.foodDetails.rotiCount + 1 } })}
                      className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Dry Veg */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold flex items-center gap-2">Dry Vegetable</h4>
                  <input 
                    type="checkbox" 
                    checked={formData.foodDetails.dryVeg.include}
                    onChange={e => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, dryVeg: { ...formData.foodDetails.dryVeg, include: e.target.checked } } })}
                    className="w-5 h-5 accent-brand-green"
                  />
                </div>
                {formData.foodDetails.dryVeg.include && (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      {['Small', 'Big'].map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, dryVeg: { ...formData.foodDetails.dryVeg, size: size as ItemSize } } })}
                          className={`flex-1 py-2 rounded-xl border-2 transition-all text-sm font-bold ${formData.foodDetails.dryVeg.size === size ? 'border-brand-green bg-brand-light-green text-brand-green' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                        >{size}</button>
                      ))}
                    </div>
                    <div>
                      <label className="label uppercase tracking-widest text-[10px] text-slate-400">Total Portions</label>
                      <input 
                        type="number" 
                        className="input-field"
                        value={formData.foodDetails.dryVeg.portions}
                        onChange={e => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, dryVeg: { ...formData.foodDetails.dryVeg, portions: Number(e.target.value) } } })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Liquid Veg */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold flex items-center gap-2">Liquid Veg / Curry</h4>
                  <input 
                    type="checkbox" 
                    checked={formData.foodDetails.liquidVeg.include}
                    onChange={e => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, liquidVeg: { ...formData.foodDetails.liquidVeg, include: e.target.checked } } })}
                    className="w-5 h-5 accent-brand-green"
                  />
                </div>
                {formData.foodDetails.liquidVeg.include && (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      {['Small', 'Big'].map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, liquidVeg: { ...formData.foodDetails.liquidVeg, size: size as ItemSize } } })}
                          className={`flex-1 py-2 rounded-xl border-2 transition-all text-sm font-bold ${formData.foodDetails.liquidVeg.size === size ? 'border-brand-green bg-brand-light-green text-brand-green' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                        >{size}</button>
                      ))}
                    </div>
                    <div>
                      <label className="label uppercase tracking-widest text-[10px] text-slate-400">Total Portions</label>
                      <input 
                        type="number" 
                        className="input-field"
                        value={formData.foodDetails.liquidVeg.portions}
                        onChange={e => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, liquidVeg: { ...formData.foodDetails.liquidVeg, portions: Number(e.target.value) } } })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Extras Grid */}
              <div className="card space-y-6">
                <h4 className="font-bold flex items-center gap-2">Extras</h4>
                <div className="space-y-4">
                  {(['salad', 'rice', 'dahi'] as const).map(item => (
                    <div key={item} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={formData.foodDetails[item].include}
                          onChange={e => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, [item]: { ...formData.foodDetails[item], include: e.target.checked } } })}
                          className="w-5 h-5 accent-brand-green"
                        />
                        <span className="font-bold text-sm capitalize">{item === 'dahi' ? 'Dahi / Yogurt' : item}</span>
                      </div>
                      {formData.foodDetails[item].include && (
                        <div className="flex gap-1">
                          {['Small', 'Big'].map(size => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, [item]: { ...formData.foodDetails[item], size: size as ItemSize } } })}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${formData.foodDetails[item].size === size ? 'border-brand-green bg-brand-green text-white shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                            >{size}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences and Notes */}
              <div className="md:col-span-2 space-y-4">
                <div className="card grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                    <label className="label uppercase tracking-widest text-[10px] text-slate-400">Spice Level</label>
                    <div className="flex gap-2">
                       {['Mild', 'Medium', 'Spicy'].map(level => (
                         <button
                           key={level}
                           type="button"
                           onClick={() => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, spiceLevel: level as SpiceLevel } })}
                           className={`flex-1 py-2 rounded-xl border-2 transition-all text-xs font-bold ${formData.foodDetails.spiceLevel === level ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                         >{level}</button>
                       ))}
                    </div>
                  </div>
                  <div>
                    <label className="label uppercase tracking-widest text-[10px] text-slate-400">Oil Level</label>
                    <div className="flex gap-2">
                       {['Less oil', 'Normal oil'].map(level => (
                         <button
                           key={level}
                           type="button"
                           onClick={() => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, oilLevel: level as OilLevel } })}
                           className={`flex-1 py-2 rounded-xl border-2 transition-all text-xs font-bold ${formData.foodDetails.oilLevel === level ? 'border-brand-green bg-green-50 text-brand-green' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                         >{level}</button>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="card space-y-4">
                   <div>
                    <label className="label uppercase tracking-widest text-[10px] text-slate-400">Food Preferences</label>
                    <textarea 
                      className="input-field h-16 pt-2"
                      placeholder="e.g. No onion, No garlic"
                      value={formData.foodDetails.preferences}
                      onChange={e => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, preferences: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="label uppercase tracking-widest text-[10px] text-slate-400">Allergies</label>
                    <input 
                      type="text"
                      className="input-field"
                      placeholder="e.g. Peanuts, Dairy"
                      value={formData.foodDetails.allergies}
                      onChange={e => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, allergies: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="label uppercase tracking-widest text-[10px] text-slate-400">Special Instructions</label>
                    <textarea 
                      className="input-field h-16 pt-2"
                      placeholder="Any specific delivery instructions"
                      value={formData.foodDetails.specialInstructions}
                      onChange={e => setFormData({ ...formData, foodDetails: { ...formData.foodDetails, specialInstructions: e.target.value } })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between pt-8 border-t border-slate-100">
          <button
            type="button"
            onClick={step === 1 ? onCancel : () => setStep(step - 1)}
            className="btn-ghost flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            {step === 1 ? 'Cancel' : 'Previous'}
          </button>
          
          <div className="flex gap-3">
             {step < 3 ? (
               <button
                 type="button"
                 onClick={() => setStep(step + 1)}
                 className="btn-primary px-8 flex items-center gap-2"
               >
                 Next step <ChevronRight size={20} />
               </button>
             ) : (
               <button
                 type="submit"
                 className="btn-secondary px-8 flex items-center gap-2 shadow-xl hover:shadow-brand-green/20"
               >
                 <Save size={20} />
                 {customer ? 'Update Member' : 'Complete Registration'}
               </button>
             )}
          </div>
        </div>
      </form>
    </div>
  );
}

// Fixed import for motion
import { motion } from 'motion/react';
