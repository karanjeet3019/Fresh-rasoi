import React from 'react';
import { 
  ClipboardList, 
  ChevronRight, 
  Utensils, 
  ChefHat, 
  ArrowRight
} from 'lucide-react';
import { Customer, DAYS, DayOfWeek } from '../types';

interface WeeklySummaryProps {
  customers: Customer[];
}

export default function WeeklySummary({ customers }: WeeklySummaryProps) {
  const activeCustomers = customers.filter(c => c.status === 'Active');

  const getDaySummary = (day: DayOfWeek) => {
    const dayCustomers = activeCustomers.filter(c => c.deliveryDays.includes(day));
    
    return {
      tiffins: dayCustomers.length,
      rotis: dayCustomers.reduce((acc, curr) => acc + curr.foodDetails.rotiCount, 0),
      
      drySmall: dayCustomers.filter(c => c.foodDetails.dryVeg.include && c.foodDetails.dryVeg.size === 'Small').length,
      dryBig: dayCustomers.filter(c => c.foodDetails.dryVeg.include && c.foodDetails.dryVeg.size === 'Big').length,
      dryPortions: dayCustomers.reduce((acc, curr) => acc + (curr.foodDetails.dryVeg.include ? curr.foodDetails.dryVeg.portions : 0), 0),
      
      liqSmall: dayCustomers.filter(c => c.foodDetails.liquidVeg.include && c.foodDetails.liquidVeg.size === 'Small').length,
      liqBig: dayCustomers.filter(c => c.foodDetails.liquidVeg.include && c.foodDetails.liquidVeg.size === 'Big').length,
      liqPortions: dayCustomers.reduce((acc, curr) => acc + (curr.foodDetails.liquidVeg.include ? curr.foodDetails.liquidVeg.portions : 0), 0),
      
      saladSmall: dayCustomers.filter(c => c.foodDetails.salad.include && c.foodDetails.salad.size === 'Small').length,
      saladBig: dayCustomers.filter(c => c.foodDetails.salad.include && c.foodDetails.salad.size === 'Big').length,
      
      riceSmall: dayCustomers.filter(c => c.foodDetails.rice.include && c.foodDetails.rice.size === 'Small').length,
      riceBig: dayCustomers.filter(c => c.foodDetails.rice.include && c.foodDetails.rice.size === 'Big').length,
      
      dahiSmall: dayCustomers.filter(c => c.foodDetails.dahi.include && c.foodDetails.dahi.size === 'Small').length,
      dahiBig: dayCustomers.filter(c => c.foodDetails.dahi.include && c.foodDetails.dahi.size === 'Big').length,
    };
  };

  const weeklyTotals = DAYS.reduce((acc, day) => {
    const s = getDaySummary(day);
    return {
      tiffins: acc.tiffins + s.tiffins,
      rotis: acc.rotis + s.rotis,
      dryPortions: acc.dryPortions + s.dryPortions,
      liqPortions: acc.liqPortions + s.liqPortions,
      salads: acc.salads + s.saladSmall + s.saladBig,
      rice: acc.rice + s.riceSmall + s.riceBig,
      dahi: acc.dahi + s.dahiSmall + s.dahiBig,
    };
  }, { tiffins: 0, rotis: 0, dryPortions: 0, liqPortions: 0, salads: 0, rice: 0, dahi: 0 });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-brand-deep-green mb-1">Weekly Summary</h2>
          <p className="text-slate-500">Inventory and prep totals from {activeCustomers.length} active tiffins.</p>
        </div>
        <div className="bg-brand-orange/10 p-4 rounded-2xl border border-brand-orange/20">
          <p className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-1">Total Weekly Tiffins</p>
          <p className="text-3xl font-black text-brand-orange">{weeklyTotals.tiffins}</p>
        </div>
      </div>

      {/* Full Weekly Totals Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Weekly Rotis', value: weeklyTotals.rotis, color: 'border-b-brand-orange' },
          { label: 'Dry Portions', value: weeklyTotals.dryPortions, color: 'border-b-brand-green' },
          { label: 'Curry Portions', value: weeklyTotals.liqPortions, color: 'border-b-blue-500' },
          { label: 'Total Salads', value: weeklyTotals.salads, color: 'border-b-green-400' },
          { label: 'Total Rice', value: weeklyTotals.rice, color: 'border-b-amber-500' },
          { label: 'Total Dahi', value: weeklyTotals.dahi, color: 'border-b-sky-400' },
          { label: 'Avg Tiffins/Day', value: (weeklyTotals.tiffins / 6).toFixed(1), color: 'border-b-slate-400' },
        ].map((stat, i) => (
          <div key={i} className={`card flex flex-col items-center justify-center py-4 border-b-4 ${stat.color}`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</span>
            <span className="text-xl font-bold text-slate-800">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {DAYS.map((day) => {
          const s = getDaySummary(day);
          return (
            <div key={day} className="card overflow-hidden !p-0 border border-slate-100 group">
              <div className="bg-white p-4 border-b border-slate-50 flex items-center justify-between group-hover:bg-brand-cream/30 transition-colors">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold font-display text-brand-deep-green w-24">{day}</h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-brand-light-green text-brand-green text-xs font-bold rounded-full">{s.tiffins} Tiffins</span>
                    <span className="px-3 py-1 bg-orange-50 text-brand-orange text-xs font-bold rounded-full">{s.rotis} Rotis</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
                {/* Dry Vegetables Column */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                    <ChefHat size={16} className="text-brand-green" /> Dry Veg Prep
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-slate-800">{s.drySmall}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Small Bags</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-slate-800">{s.dryBig}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Big Bags</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-600 bg-slate-50 p-2 rounded-lg flex justify-between items-center">
                    <span>Total Portions</span>
                    <span className="font-bold text-brand-green">{s.dryPortions}</span>
                  </p>
                </div>

                {/* Liquid Vegetables Column */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Utensils size={16} className="text-blue-500" /> Curry / Liq. Veg
                  </h4>
                   <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-slate-800">{s.liqSmall}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Small Bags</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-slate-800">{s.liqBig}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Big Bags</span>
                    </div>
                  </div>
                   <p className="text-sm font-medium text-slate-600 bg-slate-50 p-2 rounded-lg flex justify-between items-center">
                    <span>Total Portions</span>
                    <span className="font-bold text-blue-600">{s.liqPortions}</span>
                  </p>
                </div>

                {/* Extras Column */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                    <ArrowRight size={16} className="text-amber-500" /> Extras & Sides
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                       <p className="text-lg font-bold text-slate-800">{s.saladSmall + s.saladBig}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Salad</p>
                       <p className="text-[9px] text-slate-400">({s.saladSmall}S {s.saladBig}B)</p>
                    </div>
                    <div className="text-center">
                       <p className="text-lg font-bold text-slate-800">{s.riceSmall + s.riceBig}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Rice</p>
                       <p className="text-[9px] text-slate-400">({s.riceSmall}S {s.riceBig}B)</p>
                    </div>
                    <div className="text-center">
                       <p className="text-lg font-bold text-slate-800">{s.dahiSmall + s.dahiBig}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Dahi</p>
                       <p className="text-[9px] text-slate-400">({s.dahiSmall}S {s.dahiBig}B)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
