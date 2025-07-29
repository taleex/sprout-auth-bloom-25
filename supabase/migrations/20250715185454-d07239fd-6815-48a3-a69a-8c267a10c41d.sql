-- Create investment accounts table
CREATE TABLE public.investment_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  total_deposits NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assets table
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  asset_type TEXT NOT NULL DEFAULT 'stock',
  current_price NUMERIC NOT NULL DEFAULT 0,
  price_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create allocations table
CREATE TABLE public.allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  investment_account_id UUID NOT NULL,
  asset_id UUID NOT NULL,
  percentage NUMERIC NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  initial_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(investment_account_id, asset_id)
);

-- Create deposits table
CREATE TABLE public.deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  investment_account_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  deposit_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.investment_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for investment_accounts
CREATE POLICY "Users can view their own investment accounts" 
ON public.investment_accounts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own investment accounts" 
ON public.investment_accounts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investment accounts" 
ON public.investment_accounts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own investment accounts" 
ON public.investment_accounts 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for assets (public read)
CREATE POLICY "Anyone can view assets" 
ON public.assets 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can create assets" 
ON public.assets 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- RLS Policies for allocations
CREATE POLICY "Users can view allocations for their investment accounts" 
ON public.allocations 
FOR SELECT 
USING (investment_account_id IN (
  SELECT id FROM public.investment_accounts WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create allocations for their investment accounts" 
ON public.allocations 
FOR INSERT 
WITH CHECK (investment_account_id IN (
  SELECT id FROM public.investment_accounts WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update allocations for their investment accounts" 
ON public.allocations 
FOR UPDATE 
USING (investment_account_id IN (
  SELECT id FROM public.investment_accounts WHERE user_id = auth.uid()
));

CREATE POLICY "Users can delete allocations for their investment accounts" 
ON public.allocations 
FOR DELETE 
USING (investment_account_id IN (
  SELECT id FROM public.investment_accounts WHERE user_id = auth.uid()
));

-- RLS Policies for deposits
CREATE POLICY "Users can view deposits for their investment accounts" 
ON public.deposits 
FOR SELECT 
USING (investment_account_id IN (
  SELECT id FROM public.investment_accounts WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create deposits for their investment accounts" 
ON public.deposits 
FOR INSERT 
WITH CHECK (investment_account_id IN (
  SELECT id FROM public.investment_accounts WHERE user_id = auth.uid()
));

-- Add foreign key relationships
ALTER TABLE public.allocations 
ADD CONSTRAINT allocations_investment_account_id_fkey 
FOREIGN KEY (investment_account_id) REFERENCES public.investment_accounts(id) ON DELETE CASCADE;

ALTER TABLE public.allocations 
ADD CONSTRAINT allocations_asset_id_fkey 
FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON DELETE CASCADE;

ALTER TABLE public.deposits 
ADD CONSTRAINT deposits_investment_account_id_fkey 
FOREIGN KEY (investment_account_id) REFERENCES public.investment_accounts(id) ON DELETE CASCADE;

-- Create triggers for updated_at columns
CREATE TRIGGER update_investment_accounts_updated_at
BEFORE UPDATE ON public.investment_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_allocations_updated_at
BEFORE UPDATE ON public.allocations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample assets
INSERT INTO public.assets (symbol, name, asset_type, current_price) VALUES
('BTC', 'Bitcoin', 'crypto', 45000),
('ETH', 'Ethereum', 'crypto', 3000),
('AAPL', 'Apple Inc.', 'stock', 150),
('GOOGL', 'Alphabet Inc.', 'stock', 140),
('TSLA', 'Tesla Inc.', 'stock', 200),
('SPY', 'SPDR S&P 500 ETF', 'etf', 450),
('QQQ', 'Invesco QQQ Trust', 'etf', 380);