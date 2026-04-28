import { Customer, PaymentRecord } from '../types';
import { DEMO_CUSTOMERS } from './demoData';

const STORAGE_KEY = 'freshers_rasoi_data';

export const getCustomers = (): Customer[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CUSTOMERS));
    return DEMO_CUSTOMERS;
  }
  return JSON.parse(data);
};

export const saveCustomers = (customers: Customer[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
};

export const addCustomer = (customer: Omit<Customer, 'id' | 'paymentHistory'>) => {
  const customers = getCustomers();
  const newCustomer: Customer = {
    ...customer,
    id: Math.random().toString(36).substr(2, 9),
    paymentHistory: []
  };
  customers.push(newCustomer);
  saveCustomers(customers);
  return newCustomer;
};

export const updateCustomer = (id: string, updates: Partial<Customer>) => {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...updates };
    saveCustomers(customers);
  }
};

export const deleteCustomer = (id: string) => {
  const customers = getCustomers();
  const filtered = customers.filter(c => c.id !== id);
  saveCustomers(filtered);
};

export const addPayment = (customerId: string, payment: Omit<PaymentRecord, 'id' | 'date'>) => {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === customerId);
  if (index !== -1) {
    const today = new Date().toISOString().split('T')[0];
    const newPayment: PaymentRecord = {
      ...payment,
      id: Math.random().toString(36).substr(2, 9),
      date: today
    };
    
    // Update next payment due date to 1 month later
    const nextDue = new Date(today);
    nextDue.setMonth(nextDue.getMonth() + 1);
    
    customers[index].paymentHistory.push(newPayment);
    customers[index].lastPaymentDate = today;
    customers[index].nextPaymentDueDate = nextDue.toISOString().split('T')[0];
    
    saveCustomers(customers);
    return customers[index];
  }
  return null;
};
