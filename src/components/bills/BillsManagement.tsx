
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import RecurringTable from './RecurringTable';
import AddBillSidebar from './AddBillSidebar';
import { useBillsTable } from '@/hooks/useBillsTable';
import { Bill } from '@/types/bills';

interface BillsManagementProps {
  bills: any[];
  isLoading: boolean;
  onSaveBill: (bill: any) => Promise<void>;
  onUpdateBill: (id: string, updates: any) => Promise<void>;
  onDeleteBill: (id: string) => Promise<void>;
}

const BillsManagement: React.FC<BillsManagementProps> = ({
  bills,
  isLoading,
  onSaveBill,
  onUpdateBill,
  onDeleteBill
}) => {
  const [isAddingBill, setIsAddingBill] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const { newBill, updateNewBill, resetNewBill, setNewBill } = useBillsTable();

  const handleAddBill = () => {
    resetNewBill();
    setIsAddingBill(true);
  };

  const handleEditBill = (bill: Bill) => {
    setNewBill({
      name: bill.name,
      amount: bill.amount,
      type: bill.type,
      repeat_pattern: bill.repeat_pattern,
      category_id: bill.category_id,
      notes: bill.notes,
      account_id: bill.account_id,
      specific_day: bill.specific_day,
    });
    setEditingBill(bill);
    setIsAddingBill(true);
  };

  const handleSaveBill = async () => {
    try {
      if (editingBill) {
        await onUpdateBill(editingBill.id, newBill);
      } else {
        await onSaveBill(newBill);
      }
      resetNewBill();
      setEditingBill(null);
      setIsAddingBill(false);
    } catch (error) {
      console.error('Error saving bill:', error);
    }
  };

  const handleCancelAdd = () => {
    resetNewBill();
    setEditingBill(null);
    setIsAddingBill(false);
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl shadow-sm border border-border">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading recurring transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Recurring Transactions</h2>
                <p className="text-sm mt-1 text-muted-foreground">
                  {bills.length} {bills.length === 1 ? 'transaction' : 'transactions'} configured
                </p>
              </div>
              <Button 
                onClick={handleAddBill}
                className="bg-primary text-primary-foreground font-medium shadow-sm hover:bg-primary/90 transition-colors"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Recurring
              </Button>
            </div>
          </div>

          {/* Bills Table */}
          <div className="p-6">
            {bills.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-foreground">No recurring transactions yet</h3>
                <p className="mb-6 text-muted-foreground">Start by adding your first recurring transaction</p>
                <Button 
                  onClick={handleAddBill} 
                  variant="outline"
                  className="border-border hover:bg-muted text-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Transaction
                </Button>
              </div>
            ) : (
              <RecurringTable
                bills={bills}
                isLoading={isLoading}
                isAddingBill={false}
                onSaveBill={handleSaveBill}
                onCancelAdd={handleCancelAdd}
                onUpdateBill={onUpdateBill}
                onDeleteBill={onDeleteBill}
                onEditBill={handleEditBill}
                newBill={newBill}
                onUpdateNewBill={updateNewBill}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Bill Sidebar */}
      <AddBillSidebar
        isOpen={isAddingBill}
        onClose={handleCancelAdd}
        newBill={newBill}
        onUpdateBill={updateNewBill}
        onSave={handleSaveBill}
        isEditing={!!editingBill}
        editingBillName={editingBill?.name}
      />
    </>
  );
};

export default BillsManagement;
