
import React from 'react';
import { NewBillData } from '@/types/bills';
import { useBillFormValidation } from '@/hooks/useBillFormValidation';
import BillFormFields from './shared/BillFormFields';
import BillFormActions from './shared/BillFormActions';

interface AddBillFormProps {
  newBill: NewBillData;
  onUpdateBill: (updates: Partial<NewBillData>) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
  isDesktop?: boolean;
}

const AddBillForm: React.FC<AddBillFormProps> = ({
  newBill,
  onUpdateBill,
  onSave,
  onCancel,
  isDesktop = false,
}) => {
  const { validateBill } = useBillFormValidation();

  const handleSave = async () => {
    const validationError = validateBill(newBill);
    if (validationError) {
      // Use toast instead of alert for better UX
      console.error('Validation error:', validationError);
      return;
    }
    
    await onSave();
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h4 className="text-lg font-semibold text-foreground">Add New Recurring Transaction</h4>
        <p className="text-sm text-muted-foreground">Create a recurring income or expense</p>
      </div>
      
      <BillFormFields
        bill={newBill}
        onUpdateBill={onUpdateBill}
        layout="grid"
      />
      
      <BillFormActions
        onSave={handleSave}
        onCancel={onCancel}
        layout="horizontal"
      />
    </div>
  );
};

export default AddBillForm;
