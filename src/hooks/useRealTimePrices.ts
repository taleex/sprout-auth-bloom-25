import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useInvestmentAccounts } from './useInvestmentAccounts';

export const useRealTimePrices = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { refreshPrices } = useInvestmentAccounts();

  useEffect(() => {
    // Set up interval for crypto price updates (every 60 seconds)
    const startRealTimeUpdates = () => {
      intervalRef.current = setInterval(async () => {
        try {
          // Only update if we have crypto assets that need real-time updates
          const { data: cryptoAssets } = await supabase
            .from('assets')
            .select('id')
            .eq('asset_type', 'crypto')
            .eq('update_frequency', 'realtime');

          if (cryptoAssets && cryptoAssets.length > 0) {
            await refreshPrices();
          }
        } catch (error) {
          console.error('Error in real-time price updates:', error);
        }
      }, 60000); // 60 seconds
    };

    startRealTimeUpdates();

    // Listen for real-time changes to assets table
    const channel = supabase
      .channel('asset-price-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'assets'
        },
        () => {
          // Asset price was updated, trigger a refresh of investment accounts
          // This will update the UI with new portfolio values
          refreshPrices();
        }
      )
      .subscribe();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [refreshPrices]);

  return {
    // Manual refresh function
    refreshPrices
  };
};