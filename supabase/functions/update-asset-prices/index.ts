import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PriceData {
  symbol: string;
  price: number;
  market_cap?: number;
  volume_24h?: number;
  price_change_24h?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get assets that need price updates
    const now = new Date();
    const realtimeThreshold = new Date(now.getTime() - 60000).toISOString();
    const hourlyThreshold = new Date(now.getTime() - 3600000).toISOString();
    const dailyThreshold = new Date(now.getTime() - 86400000).toISOString();
    
    const { data: assets, error: assetsError } = await supabase
      .from('assets')
      .select('*')
      .or(`and(update_frequency.eq.realtime,last_price_fetch.lt.${realtimeThreshold}),and(update_frequency.eq.hourly,last_price_fetch.lt.${hourlyThreshold}),and(update_frequency.eq.daily,last_price_fetch.lt.${dailyThreshold})`);

    if (assetsError) {
      console.error('Error fetching assets:', assetsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch assets' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!assets || assets.length === 0) {
      return new Response(JSON.stringify({ message: 'No assets need updating' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Separate crypto and stock/ETF assets
    const cryptoAssets = assets.filter(asset => asset.asset_type === 'crypto');
    const stockAssets = assets.filter(asset => ['stock', 'etf'].includes(asset.asset_type));

    const updatedAssets: PriceData[] = [];

    // Update crypto prices using CoinGecko API
    if (cryptoAssets.length > 0) {
      const cryptoSymbols = cryptoAssets.map(asset => asset.symbol.toLowerCase()).join(',');
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoSymbols}&vs_currencies=eur&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
        );
        
        if (response.ok) {
          const data = await response.json();
          for (const asset of cryptoAssets) {
            const symbolData = data[asset.symbol.toLowerCase()];
            if (symbolData) {
              updatedAssets.push({
                symbol: asset.symbol,
                price: symbolData.eur || asset.current_price,
                market_cap: symbolData.eur_market_cap || 0,
                volume_24h: symbolData.eur_24h_vol || 0,
                price_change_24h: symbolData.eur_24h_change || 0
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
      }
    }

    // For stocks/ETFs, we'll use a placeholder since most free APIs have limitations
    // In production, you'd integrate with Alpha Vantage, Yahoo Finance, or similar
    for (const asset of stockAssets) {
      // Simulate small price changes for demo purposes
      const changePercent = (Math.random() - 0.5) * 0.02; // ±1% change
      const newPrice = asset.current_price * (1 + changePercent);
      
      updatedAssets.push({
        symbol: asset.symbol,
        price: Number(newPrice.toFixed(2)),
        market_cap: asset.market_cap || 0,
        volume_24h: asset.volume_24h || 0,
        price_change_24h: changePercent * 100
      });
    }

    // Update asset prices in database
    for (const priceData of updatedAssets) {
      const asset = assets.find(a => a.symbol === priceData.symbol);
      if (!asset) continue;

      // Update asset table
      await supabase
        .from('assets')
        .update({
          current_price: priceData.price,
          market_cap: priceData.market_cap,
          volume_24h: priceData.volume_24h,
          price_change_24h: priceData.price_change_24h,
          price_updated_at: now.toISOString(),
          last_price_fetch: now.toISOString()
        })
        .eq('id', asset.id);

      // Add to price history
      await supabase
        .from('price_history')
        .insert({
          asset_id: asset.id,
          price: priceData.price,
          market_cap: priceData.market_cap,
          volume_24h: priceData.volume_24h,
          recorded_at: now.toISOString(),
          source: asset.asset_type === 'crypto' ? 'coingecko' : 'simulated'
        });
    }

    return new Response(JSON.stringify({ 
      message: `Updated ${updatedAssets.length} assets`,
      updated: updatedAssets 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in update-asset-prices function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})