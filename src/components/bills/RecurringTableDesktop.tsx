import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BillRow from './BillRow';
import AddBillForm from './AddBillForm';

interface RecurringTableDesktopProps {
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

const RecurringTableDesktop: React.FC<RecurringTableDesktopProps> = ({
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
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="text-foreground font-semibold">Transaction Name</TableHead>
            <TableHead className="text-foreground font-semibold">Frequency</TableHead>
            <TableHead className="text-foreground font-semibold">Account</TableHead>
            <TableHead className="text-foreground font-semibold">Category</TableHead>
            <TableHead className="text-foreground font-semibold">Amount (€)</TableHead>
            <TableHead className="text-foreground font-semibold">Type</TableHead>
            <TableHead className="text-center text-foreground font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <BillRow
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
              isDesktop
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecurringTableDesktop;