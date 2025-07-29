import React, { useState } from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction } from '@/types/transactions';
import { formatCurrency } from '@/lib/utils';

interface TransactionDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  onSuccess: () => void;
}

export const TransactionDeleteDialog: React.FC<TransactionDeleteDialogProps> = ({
  isOpen,
  onClose,
  transaction,
  onSuccess
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      // First, revert the balance changes
      if (transaction.type === 'expense') {
        // Add back the amount to the account
        const accountId = transaction.account_id || transaction.source_account_id;
        if (accountId) {
          const { error: balanceError } = await supabase.rpc('update_account_balance', {
            account_id: accountId,
            amount_change: transaction.amount
          });
          if (balanceError) throw balanceError;
        }
      } else if (transaction.type === 'income') {
        // Subtract the amount from the account
        const accountId = transaction.account_id || transaction.destination_account_id;
        if (accountId) {
          const { error: balanceError } = await supabase.rpc('update_account_balance', {
            account_id: accountId,
            amount_change: -transaction.amount
          });
          if (balanceError) throw balanceError;
        }
      } else if (transaction.type === 'transfer') {
        // Revert transfer: add back to source, subtract from destination
        if (transaction.source_account_id) {
          const { error: sourceError } = await supabase.rpc('update_account_balance', {
            account_id: transaction.source_account_id,
            amount_change: transaction.amount
          });
          if (sourceError) throw sourceError;
        }
        if (transaction.destination_account_id) {
          const { error: destError } = await supabase.rpc('update_account_balance', {
            account_id: transaction.destination_account_id,
            amount_change: -transaction.amount
          });
          if (destError) throw destError;
        }
      }

      // Then delete the transaction
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transaction.id);

      if (error) throw error;

      // Invalidate both transactions and accounts cache
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });

      toast({
        title: 'Transaction deleted',
        description: 'Transaction has been successfully removed and balances updated.',
      });

      onSuccess();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: error.message || 'Failed to delete transaction.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-card border-border shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground text-xl font-semibold">
            Delete Transaction
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this transaction?
            </p>
            <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-3">
              <div className="font-medium text-foreground text-lg">
                {transaction.description || 'Transaction'}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{transaction.category}</span>
                  {transaction.account_name && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{transaction.account_name}</span>
                    </>
                  )}
                </div>
                <div className={`font-bold text-lg ${
                  transaction.type === 'expense' 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3">
              <span className="font-medium text-amber-800 dark:text-amber-200">Warning:</span> This action cannot be undone. The account balance will be automatically updated.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel 
            disabled={isDeleting}
            className="border-border hover:bg-muted text-foreground"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white border-0 font-medium transition-colors"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </div>
            ) : (
              'Delete Transaction'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
