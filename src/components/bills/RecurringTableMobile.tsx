import React from 'react';
import MobileBillCard from './MobileBillCard';
import AddBillForm from './AddBillForm';

interface RecurringTableMobileProps {
  bills: any[];
  isLoading: boolean;
  isAddingBill: boolean;
  onSaveBill: () => Promise<void>;
  onCancelAdd: () => void;
  onUpdateExistingBill: (id: string, updates: any) => Promise<void>;
  onDeleteBill: (id: string) => Promise<void>;
  onEditBill?: (bill: any) => void;
  newBill?: any;
  onUpdateBill?: (updates: any) => void;
}

const RecurringTableMobile: React.FC<RecurringTableMobileProps> = ({
  bills,
  isAddingBill,
  onSaveBill,
  onCancelAdd,
  onUpdateExistingBill,
  onDeleteBill,
  onEditBill,
  newBill,
  onUpdateBill
}) => {
  return (
    <div className="md:hidden space-y-4">
      {bills.map((bill) => (
        <MobileBillCard
          key={bill.id}
          bill={bill}
          onUpdate={(updates) => onUpdateExistingBill(bill.id, updates)}
          onDelete={() => onDeleteBill(bill.id)}
          onEdit={() => onEditBill?.(bill)}
        />
      ))}
      {isAddingBill && newBill && onUpdateBill && (
        <AddBillForm
          newBill={newBill}
          onUpdateBill={onUpdateBill}
          onSave={onSaveBill}
          onCancel={onCancelAdd}
        />
      )}
    </div>
  );
};

export default RecurringTableMobile;