
import { NewBillData } from '@/types/bills';

export const useBillFormValidation = () => {
  const validateBill = (bill: NewBillData): string | null => {
    if (!bill.name.trim()) {
      return 'Please enter a bill name';
    }
    if (bill.amount <= 0) {
      return 'Please enter a valid amount';
    }
    if (!bill.account_id) {
      return 'Please select an account for this bill';
    }
    if ((bill.repeat_pattern === 'monthly' || bill.repeat_pattern === 'yearly') && !bill.specific_day) {
      return `Please select a specific day for ${bill.repeat_pattern} bills`;
    }
    return null;
  };

  return { validateBill };
};
