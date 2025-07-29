import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CoinGeckoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price?: number;
  market_cap?: number;
  market_cap_rank?: number;
  total_volume?: number;
  price_change_percentage_24h?: number;
}

interface StockAsset {
  symbol: string;
  name: string;
  type: 'stock' | 'etf';
  price?: number;
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

    console.log('Starting asset population...');
    
    // Get top cryptocurrencies from CoinGecko
    console.log('Fetching crypto assets from CoinGecko...');
    const cryptoAssets: CoinGeckoAsset[] = [];
    
    try {
      const cryptoResponse = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=250&page=1&sparkline=false&locale=en'
      );
      
      if (cryptoResponse.ok) {
        const cryptoData = await cryptoResponse.json();
        cryptoAssets.push(...cryptoData);
        console.log(`Fetched ${cryptoData.length} crypto assets`);
      }
    } catch (error) {
      console.error('Error fetching crypto assets:', error);
    }

    // Popular stocks and ETFs (using a curated list since most APIs require authentication)
    const stockAssets: StockAsset[] = [
      // Popular US Stocks
      { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', price: 195.89 },
      { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock', price: 445.21 },
      { symbol: 'GOOGL', name: 'Alphabet Inc. Class A', type: 'stock', price: 178.32 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock', price: 186.43 },
      { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock', price: 248.50 },
      { symbol: 'META', name: 'Meta Platforms Inc.', type: 'stock', price: 563.27 },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'stock', price: 940.30 },
      { symbol: 'NFLX', name: 'Netflix Inc.', type: 'stock', price: 672.19 },
      { symbol: 'DIS', name: 'The Walt Disney Company', type: 'stock', price: 102.45 },
      { symbol: 'UBER', name: 'Uber Technologies Inc.', type: 'stock', price: 72.18 },
      { symbol: 'SPOT', name: 'Spotify Technology S.A.', type: 'stock', price: 385.92 },
      { symbol: 'PYPL', name: 'PayPal Holdings Inc.', type: 'stock', price: 78.45 },
      { symbol: 'COIN', name: 'Coinbase Global Inc.', type: 'stock', price: 245.67 },
      { symbol: 'SQ', name: 'Block Inc.', type: 'stock', price: 89.32 },
      { symbol: 'SHOP', name: 'Shopify Inc.', type: 'stock', price: 78.90 },
      { symbol: 'ZOOM', name: 'Zoom Video Communications', type: 'stock', price: 68.45 },
      { symbol: 'SNAP', name: 'Snap Inc.', type: 'stock', price: 12.34 },
      { symbol: 'PINS', name: 'Pinterest Inc.', type: 'stock', price: 37.89 },
      { symbol: 'TWTR', name: 'Twitter Inc.', type: 'stock', price: 54.21 },
      { symbol: 'AMD', name: 'Advanced Micro Devices', type: 'stock', price: 152.43 },
      
      // Popular ETFs
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'etf', price: 521.34 },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'etf', price: 483.21 },
      { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'etf', price: 267.89 },
      { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', type: 'etf', price: 52.34 },
      { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', type: 'etf', price: 43.56 },
      { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', type: 'etf', price: 76.78 },
      { symbol: 'VGT', name: 'Vanguard Information Technology ETF', type: 'etf', price: 534.67 },
      { symbol: 'VHT', name: 'Vanguard Health Care ETF', type: 'etf', price: 259.45 },
      { symbol: 'VFH', name: 'Vanguard Financials ETF', type: 'etf', price: 104.32 },
      { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', type: 'etf', price: 85.67 },
      { symbol: 'GLD', name: 'SPDR Gold Trust', type: 'etf', price: 198.43 },
      { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', type: 'etf', price: 89.12 },
      { symbol: 'EEM', name: 'iShares MSCI Emerging Markets ETF', type: 'etf', price: 41.23 },
      { symbol: 'IWM', name: 'iShares Russell 2000 ETF', type: 'etf', price: 223.45 },
      { symbol: 'XLF', name: 'Financial Select Sector SPDR Fund', type: 'etf', price: 42.34 },
    ];

    console.log(`Preparing to insert ${cryptoAssets.length} crypto assets and ${stockAssets.length} stock/ETF assets`);
    
    const assetsToInsert = [];
    
    // Process crypto assets
    for (const crypto of cryptoAssets) {
      // Skip if already exists
      const { data: existing } = await supabase
        .from('assets')
        .select('id')
        .eq('symbol', crypto.symbol.toUpperCase())
        .single();
        
      if (!existing) {
        assetsToInsert.push({
          symbol: crypto.symbol.toUpperCase(),
          name: crypto.name,
          asset_type: 'crypto',
          current_price: crypto.current_price || 0,
          market_cap: crypto.market_cap || 0,
          volume_24h: crypto.total_volume || 0,
          price_change_24h: crypto.price_change_percentage_24h || 0,
          update_frequency: crypto.market_cap_rank && crypto.market_cap_rank <= 50 ? 'realtime' : 'hourly'
        });
      }
    }
    
    // Process stock/ETF assets
    for (const stock of stockAssets) {
      // Skip if already exists
      const { data: existing } = await supabase
        .from('assets')
        .select('id')
        .eq('symbol', stock.symbol)
        .single();
        
      if (!existing) {
        assetsToInsert.push({
          symbol: stock.symbol,
          name: stock.name,
          asset_type: stock.type,
          current_price: stock.price || 0,
          market_cap: 0,
          volume_24h: 0,
          price_change_24h: 0,
          update_frequency: 'daily'
        });
      }
    }

    console.log(`Inserting ${assetsToInsert.length} new assets...`);
    
    // Insert in batches to avoid timeout
    const batchSize = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < assetsToInsert.length; i += batchSize) {
      const batch = assetsToInsert.slice(i, i + batchSize);
      
      const { error: insertError } = await supabase
        .from('assets')
        .insert(batch);
        
      if (insertError) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, insertError);
      } else {
        insertedCount += batch.length;
        console.log(`Inserted batch ${i / batchSize + 1}/${Math.ceil(assetsToInsert.length / batchSize)}`);
      }
    }

    return new Response(JSON.stringify({ 
      message: `Asset population completed. Inserted ${insertedCount} new assets.`,
      crypto_assets: cryptoAssets.length,
      stock_etf_assets: stockAssets.length,
      total_inserted: insertedCount
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in populate-assets function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})