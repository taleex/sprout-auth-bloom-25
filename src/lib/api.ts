
import { supabase } from '@/integrations/supabase/client';

export const fetchTransactions = async (userId?: string) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { data, error } = await supabase
    .from('transactions')
    .select(`
      id,
      amount,
      type,
      transaction_type,
      description,
      notes,
      date,
      photo_url,
      account_id,
      category_id,
      source_account_id,
      destination_account_id,
      categories(name, icon),
      accounts!transactions_account_id_fkey(name),
      source_account:accounts!transactions_source_account_id_fkey(name),
      destination_account:accounts!transactions_destination_account_id_fkey(name)
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;

  return data.map(transaction => ({
    id: transaction.id,
    amount: Number(transaction.amount),
    type: transaction.type as 'income' | 'expense' | 'transfer',
    transaction_type: transaction.transaction_type as 'manual' | 'transfer' | 'automated',
    description: transaction.description || 'Transaction',
    notes: transaction.notes,
    date: transaction.date,
    photo_url: transaction.photo_url,
    account_id: transaction.account_id,
    category_id: transaction.category_id,
    source_account_id: transaction.source_account_id,
    destination_account_id: transaction.destination_account_id,
    category: transaction.categories?.name || 'Other',
    category_icon: transaction.categories?.icon || '📝',
    account_name: transaction.accounts?.name || 'Unknown Account',
    source_account_name: transaction.source_account?.name,
    destination_account_name: transaction.destination_account?.name,
  }));
};
