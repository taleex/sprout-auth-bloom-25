import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Asset } from '@/types/investments';

export const useAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .order('name', { ascending: true });

      if (assetsError) throw assetsError;

      setAssets(data?.map(asset => ({
        ...asset,
        asset_type: asset.asset_type as 'stock' | 'crypto' | 'etf',
        update_frequency: (asset.update_frequency as 'realtime' | 'hourly' | 'daily') || 'daily',
        last_price_fetch: asset.last_price_fetch || new Date().toISOString(),
        market_cap: asset.market_cap || 0,
        volume_24h: asset.volume_24h || 0,
        price_change_24h: asset.price_change_24h || 0
      })) || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return {
    assets,
    loading,
    error,
    refetch: fetchAssets
  };
};