
-- Create bills table to store recurring transactions
CREATE TABLE public.bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  account_id UUID REFERENCES public.accounts(id) NOT NULL,
  amount NUMERIC NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  color TEXT DEFAULT '#cbf587',
  notes TEXT,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  repeat_pattern TEXT NOT NULL CHECK (repeat_pattern IN ('daily', 'weekly', 'monthly', 'yearly', 'specific_dates')),
  repeat_interval INTEGER DEFAULT 1, -- e.g., every 2 weeks = interval 2 with weekly pattern
  specific_dates INTEGER[], -- for specific_dates pattern, store day numbers
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  include_in_forecast BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own bills" 
  ON public.bills 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bills" 
  ON public.bills 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bills" 
  ON public.bills 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bills" 
  ON public.bills 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.bills
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
