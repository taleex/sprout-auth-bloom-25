
import React, { useState } from 'react';
import { Transaction } from '@/types/transactions';
import { TransactionDeleteDialog } from '@/components/transactions/TransactionDeleteDialog';
import { TransactionMobileCard } from '@/components/transactions/mobile/TransactionMobileCard';
import { formatTransactionDate } from '@/utils/dateUtils';

interface TransactionsMobileListProps {
  transactions: Transaction[];
  onUpdate: () => void;
}

export const TransactionsMobileList: React.FC<TransactionsMobileListProps> = ({ 
  transactions, 
  onUpdate 
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const handleDeleteClick = (transaction: Transaction, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
    onUpdate();
  };

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const dateKey = formatTransactionDate(transaction.date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const sortedGroups = Object.entries(groupedTransactions).sort(([a], [b]) => {
    if (a === 'Today') return -1;
    if (b === 'Today') return 1;
    if (a === 'Yesterday') return -1;
    if (b === 'Yesterday') return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {sortedGroups.map(([dateGroup, groupTransactions]) => (
        <div key={dateGroup}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
            {dateGroup}
          </h3>
          <div className="space-y-2">
            {groupTransactions.map((transaction) => (
              <TransactionMobileCard
                key={transaction.id}
                transaction={transaction}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Delete Dialog */}
      {transactionToDelete && (
        <TransactionDeleteDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          transaction={transactionToDelete}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};
