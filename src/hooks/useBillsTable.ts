
import { useState } from 'react';
import { NewBillData } from '@/types/bills';

export const useBillsTable = () => {
  const [newBill, setNewBillState] = useState<NewBillData>({
    name: '',
    amount: 0,
    type: 'expense',
    repeat_pattern: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    account_id: '',
    category_id: '',
    specific_day: undefined,
    notification_enabled: true,
    notes: '',
  });

  const updateNewBill = (updates: Partial<NewBillData>) => {
    setNewBillState(prev => ({ ...prev, ...updates }));
  };

  const resetNewBill = () => {
    setNewBillState({
      name: '',
      amount: 0,
      type: 'expense',
      repeat_pattern: 'monthly',
      start_date: new Date().toISOString().split('T')[0],
      account_id: '',
      category_id: '',
      specific_day: undefined,
      notification_enabled: true,
      notes: '',
    });
  };

  const setNewBill = (billData: Partial<NewBillData>) => {
    setNewBillState(prev => ({ ...prev, ...billData }));
  };

  return {
    newBill,
    updateNewBill,
    resetNewBill,
    setNewBill,
  };
};
