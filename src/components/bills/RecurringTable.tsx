import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import RecurringTableDesktop from './RecurringTableDesktop';
import RecurringTableMobile from './RecurringTableMobile';

interface RecurringTableProps {
  bills: any[];
  isLoading: boolean;
  isAddingBill: boolean;
  onSaveBill: () => Promise<void>;
  onCancelAdd: () => void;
  onUpdateBill: (id: string, updates: any) => Promise<void>;
  onDeleteBill: (id: string) => Promise<void>;
  onEditBill?: (bill: any) => void;
  newBill?: any;
  onUpdateNewBill?: (updates: any) => void;
}

const RecurringTable: React.FC<RecurringTableProps> = ({
  bills,
  isLoading,
  isAddingBill,
  onSaveBill,
  onCancelAdd,
  onUpdateBill,
  onDeleteBill,
  onEditBill,
  newBill,
  onUpdateNewBill,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <RecurringTableMobile
        bills={bills}
        isLoading={isLoading}
        isAddingBill={isAddingBill}
        onSaveBill={onSaveBill}
        onCancelAdd={onCancelAdd}
        onUpdateExistingBill={onUpdateBill}
        onDeleteBill={onDeleteBill}
        onEditBill={onEditBill}
        newBill={newBill}
        onUpdateBill={onUpdateNewBill}
      />
    );
  }

  return (
    <RecurringTableDesktop
      bills={bills}
      isLoading={isLoading}
      isAddingBill={isAddingBill}
      onSaveBill={onSaveBill}
      onCancelAdd={onCancelAdd}
      onUpdateExistingBill={onUpdateBill}
      onDeleteBill={onDeleteBill}
      onEditBill={onEditBill}
      newBill={newBill}
      onUpdateBill={onUpdateNewBill}
    />
  );
};

export default RecurringTable;