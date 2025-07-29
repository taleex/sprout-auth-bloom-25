
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type SavingsGoal = Tables<'savings_goals'>;

export const useSavingsGoals = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching savings goals:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to fetch savings goals',
          description: error.message || 'An error occurred while fetching goals.',
        });
        return;
      }

      setGoals(data || []);
    } catch (error: any) {
      console.error('Error fetching savings goals:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to fetch savings goals',
        description: error.message || 'An unexpected error occurred.',
      });
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoal = async (accountId: string, targetAmount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check if goal exists for this account
      const { data: existingGoal } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('account_id', accountId)
        .single();

      if (existingGoal) {
        // Update existing goal
        const { error } = await supabase
          .from('savings_goals')
          .update({ 
            target_amount: targetAmount,
            updated_at: new Date().toISOString()
          })
          .eq('account_id', accountId);

        if (error) throw error;
      } else {
        // Create new goal
        const { error } = await supabase
          .from('savings_goals')
          .insert({
            user_id: user.id,
            account_id: accountId,
            target_amount: targetAmount,
          });

        if (error) throw error;
      }

      toast({
        title: 'Savings goal updated',
        description: 'Your savings goal has been successfully updated.',
      });

      fetchGoals();
    } catch (error: any) {
      console.error('Error updating savings goal:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to update goal',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  useEffect(() => {
    fetchGoals();

    // Set up real-time subscription for savings goals
    const channel = supabase
      .channel('savings-goals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'savings_goals'
        },
        (payload) => {
          fetchGoals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    goals,
    isLoading,
    updateGoal,
    fetchGoals,
  };
};
