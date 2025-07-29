
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { fetchTransactions } from '@/lib/api';
import { Transaction, CategoryData } from '@/types/transactions';
import { useRealTimeUpdates } from './useRealTimeUpdates';

export const useTransactionsData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const data = await fetchTransactions(user.id);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Error loading transactions",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Use real-time updates hook
  useRealTimeUpdates({
    table: 'transactions',
    onUpdate: loadTransactions,
    enabled: !!user
  });

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Invalidate React Query cache
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      
      toast({
        title: "Transaction deleted",
        description: "Transaction has been successfully deleted",
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  }, [supabase, queryClient, user?.id, toast]);

  return {
    transactions,
    isLoading,
    refetch: loadTransactions,
    deleteTransaction,
  };
};
