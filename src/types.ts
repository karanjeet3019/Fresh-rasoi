/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type Status = 'Active' | 'Paused' | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Due Soon' | 'Due Today' | 'Overdue';

export type SpiceLevel = 'Mild' | 'Medium' | 'Spicy';

export type OilLevel = 'Less oil' | 'Normal oil';

export type ItemSize = 'Small' | 'Big';

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  notes?: string;
}

export interface FoodDetails {
  rotiCount: number;
  
  dryVeg: {
    include: boolean;
    size: ItemSize;
    portions: number;
    notes?: string;
  };
  
  liquidVeg: {
    include: boolean;
    size: ItemSize;
    portions: number;
    notes?: string;
  };
  
  salad: {
    include: boolean;
    size: ItemSize;
  };
  
  rice: {
    include: boolean;
    size: ItemSize;
  };
  
  dahi: {
    include: boolean;
    size: ItemSize;
  };

  preferences: string;
  allergies: string;
  spiceLevel: SpiceLevel;
  oilLevel: OilLevel;
  specialInstructions: string;
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  area: string;
  startDate: string;
  lastPaymentDate: string;
  nextPaymentDueDate: string;
  monthlyPrice: number;
  paymentMethod: string;
  status: Status;
  deliveryDays: DayOfWeek[];
  foodDetails: FoodDetails;
  paymentHistory: PaymentRecord[];
}

export const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const PAYMENT_METHODS = ['Cash', 'E-transfer', 'Card', 'Other'];
