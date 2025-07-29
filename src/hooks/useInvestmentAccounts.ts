
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { InvestmentAccount } from '@/types/investments';

const fetchInvestmentAccounts = async (): Promise<{
  accounts: InvestmentAccount[];
  portfolioValue: number;
  lastUpdated: string | null;
}> => {
  // Fetch investment accounts from the investment_accounts table
  const { data: accountsData, error: accountsError } = await supabase
    .from('investment_accounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (accountsError) throw accountsError;

  // Fetch all allocations and assets for portfolio value calculation
  const { data: allocationsData, error: allocationsError } = await supabase
    .from('allocations')
    .select(`
      *,
      assets (
        id,
        symbol,
        name,
        asset_type,
        current_price,
        price_updated_at,
        update_frequency,
        last_price_fetch,
        market_cap,
        volume_24h,
        price_change_24h
      )
    `)
    .eq('is_active', true); // Only get active allocations

  if (allocationsError) throw allocationsError;

  // Calculate portfolio values based on actual asset allocations
  const accountsWithValues: InvestmentAccount[] = accountsData.map(account => {
    const accountAllocations = allocationsData.filter(
      allocation => allocation.investment_account_id === account.id
    );

    let currentValue = 0;
    
    // Calculate current value based on actual invested amounts and price changes
    if (accountAllocations.length > 0) {
      currentValue = accountAllocations.reduce((sum, allocation) => {
        let allocationValue = 0;

        if (allocation.assets && allocation.assets.current_price > 0) {
          // Method 1: Use invested_amount and purchase_price if available and valid (new tracking method)
          if (allocation.invested_amount && allocation.invested_amount > 0 && 
              allocation.purchase_price && allocation.purchase_price > 0) {
            const shares = allocation.invested_amount / allocation.purchase_price;
            allocationValue = shares * allocation.assets.current_price;
          }
          // Method 2: Use percentage-based calculation with initial_price (legacy method)
          else if (allocation.percentage > 0 && allocation.initial_price > 0) {
            const allocatedAmount = (account.total_deposits * allocation.percentage) / 100;
            const priceRatio = allocation.assets.current_price / allocation.initial_price;
            allocationValue = allocatedAmount * priceRatio;
          }
          // Method 3: Fallback using percentage of total deposits (if no price data)
          else if (allocation.percentage > 0) {
            allocationValue = (account.total_deposits * allocation.percentage) / 100;
          }
        }
        
        return sum + allocationValue;
      }, 0);
    } else {
      // If no active allocations, current value equals total deposits (all cash)
      currentValue = account.total_deposits;
    }

    return {
      id: account.id,
      name: account.name,
      total_deposits: account.total_deposits,
      current_value: currentValue,
      asset_count: accountAllocations.length,
      created_at: account.created_at,
      updated_at: account.updated_at
    };
  });

  // Calculate total portfolio value
  const totalValue = accountsWithValues.reduce((sum, account) => sum + account.current_value, 0);


  // Get last price update timestamp from assets table
  const { data: assetsData } = await supabase
    .from('assets')
    .select('price_updated_at')
    .order('price_updated_at', { ascending: false })
    .limit(1);

  const lastUpdated = assetsData && assetsData.length > 0 ? assetsData[0].price_updated_at : null;

  return {
    accounts: accountsWithValues,
    portfolioValue: totalValue,
    lastUpdated
  };
};

export const useInvestmentAccounts = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['investment-accounts'],
    queryFn: fetchInvestmentAccounts,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false, // Prevent automatic refetch on window focus
  });

  const refreshAccounts = () => {
    queryClient.invalidateQueries({ queryKey: ['investment-accounts'] });
  };

  const refreshPrices = async () => {
    try {
      const { data: priceData, error } = await supabase.functions.invoke('update-asset-prices');
      if (error) throw error;
      
      // Invalidate and refetch investment accounts to get updated values
      queryClient.invalidateQueries({ queryKey: ['investment-accounts'] });
    } catch (error) {
      console.error('Error refreshing prices:', error);
      throw error;
    }
  };

  return {
    accounts: data?.accounts || [],
    loading: isLoading,
    error,
    portfolioValue: data?.portfolioValue || 0,
    lastUpdated: data?.lastUpdated || null,
    refreshAccounts,
    refreshPrices,
    refetch
  };
};
