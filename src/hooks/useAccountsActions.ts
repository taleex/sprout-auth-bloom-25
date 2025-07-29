import { Account } from '@/types/accounts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAccountsActions = (fetchAccounts: () => void) => {
  const { toast } = useToast();

  const handleSaveAccount = async (accountData: Partial<Account>) => {
    try {
      if (accountData.id) {
        // Update existing account
        const { error } = await supabase
          .from('accounts')
          .update({
            name: accountData.name,
            balance: accountData.balance,
            currency: accountData.currency,
            account_type: accountData.account_type,
            color: accountData.color,
            icon: accountData.icon,
            hide_balance: accountData.hide_balance,
          })
          .eq('id', accountData.id);

        if (error) throw error;

        toast({
          title: 'Account updated',
          description: 'The account has been successfully updated.',
        });
      } else {
        // Create new account
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        const { error } = await supabase
          .from('accounts')
          .insert({
            user_id: user.id,
            name: accountData.name || '',
            balance: accountData.balance || 0,
            currency: accountData.currency || 'EUR',
            account_type: accountData.account_type || 'main',
            color: accountData.color || '#cbf587',
            icon: accountData.icon || 'wallet',
            hide_balance: accountData.hide_balance || false,
            is_archived: false,
          });

        if (error) throw error;

        toast({
          title: 'Account created',
          description: 'The new account has been successfully created.',
        });
      }

      fetchAccounts();
    } catch (error: any) {
      console.error('Error saving account:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to save account',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Archive the account instead of deleting
      const { error } = await supabase
        .from('accounts')
        .update({ is_archived: true })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Account deleted',
        description: 'The account has been successfully deleted.',
      });
      fetchAccounts();
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete account',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    }
  };

  const handleToggleVisibility = async (id: string, hide_balance: boolean) => {
    try {
      const { error } = await supabase
        .from('accounts')
        .update({ hide_balance: !hide_balance })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Account visibility updated',
        description: 'The account visibility has been successfully updated.',
      });
      fetchAccounts();
    } catch (error: any) {
      console.error('Error toggling visibility:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to toggle visibility',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return {
    handleSaveAccount,
    handleDelete,
    handleToggleVisibility,
  };
};
