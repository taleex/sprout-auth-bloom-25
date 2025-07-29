
import { supabase } from '@/integrations/supabase/client';
import { Bill } from '@/types/bills';

export const useBillsCrud = () => {
  const addBill = async (billData: Partial<Bill>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const newBillData = {
      name: billData.name || '',
      account_id: billData.account_id || null,
      amount: billData.amount || 0,
      type: billData.type || 'expense',
      repeat_pattern: billData.repeat_pattern || 'monthly',
      repeat_interval: billData.repeat_interval || 1,
      start_date: billData.start_date || new Date().toISOString().split('T')[0],
      color: billData.color || '#cbf587',
      category_id: billData.category_id || null,
      notes: billData.notes || null,
      specific_dates: billData.specific_dates || null,
      include_in_forecast: billData.include_in_forecast ?? true,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('bills')
      .insert([newBillData])
      .select()
      .single();

    if (error) {
      console.error('Error adding bill:', error);
      throw error;
    }

    return data as Bill;
  };

  const updateBill = async (id: string, updates: Partial<Bill>) => {
    const { data, error } = await supabase
      .from('bills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating bill:', error);
      throw error;
    }

    return data as Bill;
  };

  const deleteBill = async (id: string) => {
    const { error } = await supabase
      .from('bills')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting bill:', error);
      throw error;
    }
  };

  const fetchBills = async (): Promise<Bill[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return [];
    }

    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bills:', error);
      throw error;
    }
    
    return (data || []) as Bill[];
  };

  return {
    addBill,
    updateBill,
    deleteBill,
    fetchBills,
  };
};
