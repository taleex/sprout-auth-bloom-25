
import React, { useState, memo, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Transaction } from '@/types/transactions';
import { TransactionDeleteDialog } from '@/components/transactions/TransactionDeleteDialog';
import { useCategoryInfo } from '@/utils/categoryUtils';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

interface TransactionTableProps {
  transactions: Transaction[];
  onUpdate: () => void;
  isLoading?: boolean;
}

// Track ongoing operations to prevent duplicates
const operationTracker = new Set<string>();

const TransactionTable: React.FC<TransactionTableProps> = memo(({ 
  transactions, 
  onUpdate, 
  isLoading = false 
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const { getCategoryInfo } = useCategoryInfo();

  const handleDeleteClick = useCallback((transaction: Transaction) => {
    const operationKey = `delete-${transaction.id}`;
    
    if (operationTracker.has(operationKey)) return;
    
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    const operationKey = `delete-${transactionToDelete?.id}`;
    operationTracker.delete(operationKey);
    
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
    onUpdate();
  }, [transactionToDelete?.id, onUpdate]);

  const handleDeleteCancel = useCallback(() => {
    const operationKey = `delete-${transactionToDelete?.id}`;
    operationTracker.delete(operationKey);
    
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  }, [transactionToDelete?.id]);

  const formattedTransactions = useMemo(() => {
    return transactions.map(transaction => ({
      ...transaction,
      categoryInfo: getCategoryInfo(transaction),
      formattedDate: new Date(transaction.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }));
  }, [transactions, getCategoryInfo]);

  if (isLoading) {
    return <LoadingSkeleton variant="table" count={5} />;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="bg-card shadow-sm border animate-fade-in">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No transactions found.</p>
        </CardContent>
      </Card>
    );
  }

  const TransactionRow = memo(({ transaction, index, isLast }: { 
    transaction: typeof formattedTransactions[0], 
    index: number, 
    isLast: boolean 
  }) => (
    <tr 
      className={`border-b border-border/50 hover:bg-muted/30 transition-all duration-200 animate-fade-in ${
        isLast ? 'border-b-0' : ''
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <td className="p-4">
        <Link 
          to={`/transactions/${transaction.id}`}
          className="text-foreground hover:text-primary hover:underline font-medium story-link"
        >
          {transaction.description || 'Transaction'}
        </Link>
        {transaction.notes && (
          <div className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
            {transaction.notes}
          </div>
        )}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full border border-border flex-shrink-0"
            style={{ backgroundColor: transaction.categoryInfo.color }}
          />
          <span className="text-lg">{transaction.categoryInfo.icon}</span>
          <span className="text-sm text-muted-foreground">{transaction.categoryInfo.name}</span>
        </div>
      </td>
      <td className="p-4">
        <span className="text-sm text-muted-foreground">{transaction.account_name}</span>
        {transaction.transaction_type === 'transfer' && (
          <div className="mt-1">
            <Badge 
              variant="secondary" 
              className="bg-primary/10 text-primary text-xs"
            >
              Transfer
            </Badge>
          </div>
        )}
      </td>
      <td className="p-4">
        <div className="text-sm text-muted-foreground tabular-nums">
          {transaction.formattedDate}
        </div>
        <div className="text-xs text-muted-foreground/70 capitalize">
          {transaction.transaction_type}
        </div>
      </td>
      <td className="p-4 text-right">
        <div className={`font-semibold tabular-nums ${
          transaction.type === 'income' ? 'text-success' : 
          transaction.type === 'expense' ? 'text-destructive' : 'text-primary'
        }`}>
          {transaction.type === 'expense' ? '-' : '+'}
          {formatCurrency(transaction.amount)}
        </div>
      </td>
      <td className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-accent hover-scale"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="animate-scale-in">
            <DropdownMenuItem asChild className="hover-scale">
              <Link 
                to={`/transactions/${transaction.id}`}
                className="flex items-center"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive hover-scale"
              onClick={() => handleDeleteClick(transaction)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  ));

  return (
    <>
      <Card className="bg-card shadow-sm border overflow-hidden animate-fade-in hover:shadow-elegant transition-all duration-300">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground text-sm">Description</th>
                  <th className="text-left p-4 font-medium text-foreground text-sm">Category</th>
                  <th className="text-left p-4 font-medium text-foreground text-sm">Account</th>
                  <th className="text-left p-4 font-medium text-foreground text-sm">Date</th>
                  <th className="text-right p-4 font-medium text-foreground text-sm">Amount</th>
                  <th className="w-12 p-4"></th>
                </tr>
              </thead>
              <tbody>
                {formattedTransactions.map((transaction, index) => (
                  <TransactionRow 
                    key={transaction.id}
                    transaction={transaction}
                    index={index}
                    isLast={index === formattedTransactions.length - 1}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      {transactionToDelete && (
        <TransactionDeleteDialog
          isOpen={deleteDialogOpen}
          onClose={handleDeleteCancel}
          transaction={transactionToDelete}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
});

export default TransactionTable;
