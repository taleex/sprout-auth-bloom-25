import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Allocation } from '@/types/investments';

export const useAllocations = (accountId?: string) => {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
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
            price_change_24h,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (accountId) {
        query = query.eq('investment_account_id', accountId);
      }

      const { data, error: allocationsError } = await query;

      if (allocationsError) throw allocationsError;

      setAllocations(data?.map(allocation => ({
        ...allocation,
        is_active: allocation.is_active ?? true, // Default to true for compatibility
        assets: allocation.assets ? {
          ...allocation.assets,
          asset_type: allocation.assets.asset_type as 'stock' | 'crypto' | 'etf',
          update_frequency: (allocation.assets.update_frequency as 'realtime' | 'hourly' | 'daily') || 'daily',
          last_price_fetch: allocation.assets.last_price_fetch || new Date().toISOString(),
          market_cap: allocation.assets.market_cap || 0,
          volume_24h: allocation.assets.volume_24h || 0,
          price_change_24h: allocation.assets.price_change_24h || 0
        } : undefined
      })) || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, [accountId]);

  return {
    allocations,
    loading,
    error,
    refetch: fetchAllocations
  };
};