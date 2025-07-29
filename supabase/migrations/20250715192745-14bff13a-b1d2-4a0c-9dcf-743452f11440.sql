-- First, ensure investment_accounts table structure is correct and migrate any existing investment accounts
-- Copy investment accounts from accounts table to investment_accounts table if they don't exist
INSERT INTO public.investment_accounts (id, user_id, name, total_deposits, created_at, updated_at)
SELECT 
    id,
    user_id, 
    name,
    balance as total_deposits,
    created_at,
    updated_at
FROM public.accounts 
WHERE account_type = 'investment'
ON CONFLICT (id) DO NOTHING;

-- Update allocations table to ensure it has proper foreign key constraints
ALTER TABLE public.allocations 
DROP CONSTRAINT IF EXISTS allocations_investment_account_id_fkey;

ALTER TABLE public.allocations 
ADD CONSTRAINT allocations_investment_account_id_fkey 
FOREIGN KEY (investment_account_id) 
REFERENCES public.investment_accounts(id) 
ON DELETE CASCADE;

-- Ensure RLS policies are correct for allocations table
DROP POLICY IF EXISTS "Users can create allocations for their investment accounts" ON public.allocations;
DROP POLICY IF EXISTS "Users can view allocations for their investment accounts" ON public.allocations;
DROP POLICY IF EXISTS "Users can update allocations for their investment accounts" ON public.allocations;
DROP POLICY IF EXISTS "Users can delete allocations for their investment accounts" ON public.allocations;

-- Recreate RLS policies for allocations
CREATE POLICY "Users can create allocations for their investment accounts" 
ON public.allocations 
FOR INSERT 
WITH CHECK (
    investment_account_id IN (
        SELECT id FROM public.investment_accounts 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can view allocations for their investment accounts" 
ON public.allocations 
FOR SELECT 
USING (
    investment_account_id IN (
        SELECT id FROM public.investment_accounts 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can update allocations for their investment accounts" 
ON public.allocations 
FOR UPDATE 
USING (
    investment_account_id IN (
        SELECT id FROM public.investment_accounts 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete allocations for their investment accounts" 
ON public.allocations 
FOR DELETE 
USING (
    investment_account_id IN (
        SELECT id FROM public.investment_accounts 
        WHERE user_id = auth.uid()
    )
);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_allocations_updated_at
    BEFORE UPDATE ON public.allocations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();