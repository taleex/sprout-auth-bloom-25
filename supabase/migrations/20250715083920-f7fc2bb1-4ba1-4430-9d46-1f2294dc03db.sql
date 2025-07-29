
-- Create the savings_goals table
CREATE TABLE public.savings_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  account_id uuid NOT NULL,
  target_amount numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own savings goals" 
  ON public.savings_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own savings goals" 
  ON public.savings_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own savings goals" 
  ON public.savings_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own savings goals" 
  ON public.savings_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add foreign key constraint to accounts table
ALTER TABLE public.savings_goals 
ADD CONSTRAINT savings_goals_account_id_fkey 
FOREIGN KEY (account_id) 
REFERENCES public.accounts(id) 
ON DELETE CASCADE;

-- Create trigger for updated_at
CREATE TRIGGER update_savings_goals_updated_at
  BEFORE UPDATE ON public.savings_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create unique constraint to ensure one goal per account
ALTER TABLE public.savings_goals 
ADD CONSTRAINT unique_account_goal 
UNIQUE (account_id);
