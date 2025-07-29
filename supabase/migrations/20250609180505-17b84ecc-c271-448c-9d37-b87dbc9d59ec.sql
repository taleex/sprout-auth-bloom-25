
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  icon TEXT,
  color TEXT DEFAULT '#cbf587',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#cbf587',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users,
  account_id UUID NOT NULL REFERENCES public.accounts(id),
  category_id UUID REFERENCES public.categories(id),
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  transaction_type TEXT NOT NULL DEFAULT 'manual' CHECK (transaction_type IN ('manual', 'transfer', 'automated')),
  description TEXT,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  photo_url TEXT,
  source_account_id UUID REFERENCES public.accounts(id),
  destination_account_id UUID REFERENCES public.accounts(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transaction_tags junction table for many-to-many relationship
CREATE TABLE public.transaction_tags (
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (transaction_id, tag_id)
);

-- Enable RLS for all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_tags ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read, admin write for now)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

-- Tags policies (users can read and create their own tags)
CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Anyone can create tags" ON public.tags FOR INSERT WITH CHECK (true);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON public.transactions 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own transactions" ON public.transactions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions" ON public.transactions 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions" ON public.transactions 
  FOR DELETE USING (auth.uid() = user_id);

-- Transaction tags policies
CREATE POLICY "Users can view transaction tags for their transactions" ON public.transaction_tags 
  FOR SELECT USING (
    transaction_id IN (
      SELECT id FROM public.transactions WHERE user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create transaction tags for their transactions" ON public.transaction_tags 
  FOR INSERT WITH CHECK (
    transaction_id IN (
      SELECT id FROM public.transactions WHERE user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete transaction tags for their transactions" ON public.transaction_tags 
  FOR DELETE USING (
    transaction_id IN (
      SELECT id FROM public.transactions WHERE user_id = auth.uid()
    )
  );

-- Insert default categories
INSERT INTO public.categories (name, type, icon) VALUES
  ('Groceries', 'expense', '🛒'),
  ('Rent', 'expense', '🏠'),
  ('Transport', 'expense', '🚗'),
  ('Fuel', 'expense', '⛽'),
  ('Coffee', 'expense', '☕'),
  ('Shopping', 'expense', '🛍️'),
  ('Online Shopping', 'expense', '💻'),
  ('Gifts', 'expense', '🎁'),
  ('Health', 'expense', '🏥'),
  ('Withdraw', 'expense', '💸'),
  ('Home', 'expense', '🏠'),
  ('Car', 'expense', '🚗'),
  ('Others', 'expense', '📝'),
  ('Salary', 'income', '💼'),
  ('Freelance', 'income', '💻'),
  ('Investment', 'income', '📈'),
  ('Gift Received', 'income', '🎁'),
  ('Refund', 'income', '💰'),
  ('Other Income', 'income', '💵');

-- Insert default tags
INSERT INTO public.tags (name) VALUES
  ('Essential'),
  ('Luxury'),
  ('Recurring'),
  ('One-time'),
  ('Business'),
  ('Personal'),
  ('Family'),
  ('Emergency');

-- Create trigger for updated_at
CREATE TRIGGER handle_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
