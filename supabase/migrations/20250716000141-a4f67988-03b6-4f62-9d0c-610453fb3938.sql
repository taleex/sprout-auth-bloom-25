-- Add real-time pricing fields to assets table
ALTER TABLE public.assets 
ADD COLUMN update_frequency TEXT NOT NULL DEFAULT 'daily',
ADD COLUMN last_price_fetch TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN market_cap NUMERIC DEFAULT 0,
ADD COLUMN volume_24h NUMERIC DEFAULT 0,
ADD COLUMN price_change_24h NUMERIC DEFAULT 0;

-- Add check constraint for update_frequency
ALTER TABLE public.assets 
ADD CONSTRAINT update_frequency_check 
CHECK (update_frequency IN ('realtime', 'hourly', 'daily'));

-- Create price_history table for tracking price changes
CREATE TABLE public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  market_cap NUMERIC DEFAULT 0,
  volume_24h NUMERIC DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT DEFAULT 'api'
);

-- Enable RLS on price_history
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- Create policy for price_history (public read access since prices are public data)
CREATE POLICY "Anyone can view price history" 
ON public.price_history 
FOR SELECT 
USING (true);

-- Create index for better performance on price history queries
CREATE INDEX idx_price_history_asset_id_time 
ON public.price_history (asset_id, recorded_at DESC);

-- Create index for asset price fetching
CREATE INDEX idx_assets_update_frequency_fetch_time 
ON public.assets (update_frequency, last_price_fetch);

-- Update existing crypto assets to use realtime frequency
UPDATE public.assets 
SET update_frequency = 'realtime' 
WHERE asset_type = 'crypto';

-- Update existing stock/ETF assets to use hourly frequency
UPDATE public.assets 
SET update_frequency = 'hourly' 
WHERE asset_type IN ('stock', 'etf');