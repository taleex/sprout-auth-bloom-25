
import { useState, useEffect } from 'react';
import { Bill } from '@/types/bills';
import { useBillsCrud } from './useBillsCrud';

export const useBillsState = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchBills } = useBillsCrud();

  const loadBills = async () => {
    try {
      const fetchedBills = await fetchBills();
      setBills(fetchedBills);
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBillToState = (newBill: Bill) => {
    setBills(prev => [newBill, ...prev]);
  };

  const updateBillInState = (id: string, updatedBill: Bill) => {
    setBills(prev => prev.map(bill => bill.id === id ? updatedBill : bill));
  };

  const removeBillFromState = (id: string) => {
    setBills(prev => prev.filter(bill => bill.id !== id));
  };

  useEffect(() => {
    loadBills();
  }, []);

  return {
    bills,
    isLoading,
    addBillToState,
    updateBillInState,
    removeBillFromState,
    refetch: loadBills,
  };
};
