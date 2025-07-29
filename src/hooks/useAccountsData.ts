
import { useState, useEffect, useCallback } from 'react';
import { Account } from '@/types/accounts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRealTimeUpdates } from './useRealTimeUpdates';

export const useAccountsData = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching accounts:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to fetch accounts',
          description: error.message || 'An error occurred while fetching accounts.',
        });
        return;
      }

      // Cast the data to Account[] to handle type compatibility
      setAccounts((data as Account[]) || []);
    } catch (error: any) {
      console.error('Error fetching accounts:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to fetch accounts',
        description: error.message || 'An unexpected error occurred.',
      });
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Use real-time updates hook
  useRealTimeUpdates({
    table: 'accounts',
    onUpdate: fetchAccounts,
    enabled: true
  });

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    isLoading,
    fetchAccounts,
  };
};
