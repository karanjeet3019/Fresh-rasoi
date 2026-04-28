import { Customer, DAYS } from '../types';

export const DEMO_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    phoneNumber: '9876543210',
    address: 'Flat 402, Sunshine Apartments',
    area: 'Downtown',
    startDate: '2026-03-10',
    lastPaymentDate: '2026-03-10',
    nextPaymentDueDate: '2026-04-10',
    monthlyPrice: 150,
    paymentMethod: 'E-transfer',
    status: 'Active',
    deliveryDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    foodDetails: {
      rotiCount: 4,
      dryVeg: { include: true, size: 'Small', portions: 1, notes: 'Less spicy' },
      liquidVeg: { include: true, size: 'Small', portions: 1 },
      salad: { include: true, size: 'Small' },
      rice: { include: true, size: 'Small' },
      dahi: { include: true, size: 'Small' },
      preferences: 'No onion, No garlic',
      allergies: '',
      spiceLevel: 'Mild',
      oilLevel: 'Less oil',
      specialInstructions: 'Only dry sabji on Tuesdays'
    },
    paymentHistory: [
      { id: 'p1', date: '2026-03-10', amount: 150, method: 'E-transfer', notes: 'First month' }
    ]
  },
  {
    id: '2',
    name: 'Priya Patel',
    phoneNumber: '8765432109',
    address: 'House No 12, Green Avenue',
    area: 'North Side',
    startDate: '2026-04-15',
    lastPaymentDate: '2026-04-15',
    nextPaymentDueDate: '2026-05-15',
    monthlyPrice: 180,
    paymentMethod: 'Cash',
    status: 'Active',
    deliveryDays: ['Monday', 'Wednesday', 'Friday'],
    foodDetails: {
      rotiCount: 6,
      dryVeg: { include: true, size: 'Big', portions: 1 },
      liquidVeg: { include: true, size: 'Big', portions: 1 },
      salad: { include: true, size: 'Big' },
      rice: { include: false, size: 'Small' },
      dahi: { include: true, size: 'Big' },
      preferences: '',
      allergies: 'Peanuts',
      spiceLevel: 'Medium',
      oilLevel: 'Normal oil',
      specialInstructions: ''
    },
    paymentHistory: [
      { id: 'p2', date: '2026-04-15', amount: 180, method: 'Cash' }
    ]
  },
  {
    id: '3',
    name: 'Amit Verma',
    phoneNumber: '7654321098',
    address: 'Room 5, PG Heights',
    area: 'College Square',
    startDate: '2026-04-01',
    lastPaymentDate: '2026-04-01',
    nextPaymentDueDate: '2026-05-01', // Due soon
    monthlyPrice: 140,
    paymentMethod: 'Other',
    status: 'Active',
    deliveryDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    foodDetails: {
      rotiCount: 3,
      dryVeg: { include: true, size: 'Small', portions: 1 },
      liquidVeg: { include: true, size: 'Small', portions: 1 },
      salad: { include: false, size: 'Small' },
      rice: { include: true, size: 'Small' },
      dahi: { include: false, size: 'Small' },
      preferences: 'Extra spicy',
      allergies: '',
      spiceLevel: 'Spicy',
      oilLevel: 'Normal oil',
      specialInstructions: 'No rice on Saturdays'
    },
    paymentHistory: [
      { id: 'p3', date: '2026-04-01', amount: 140, method: 'Other' }
    ]
  }
];
