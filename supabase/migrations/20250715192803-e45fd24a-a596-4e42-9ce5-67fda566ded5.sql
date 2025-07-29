-- First, migrate any existing investment accounts from accounts table to investment_accounts table
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

-- Ensure foreign key constraint exists
ALTER TABLE public.allocations 
DROP CONSTRAINT IF EXISTS allocations_investment_account_id_fkey;

ALTER TABLE public.allocations 
ADD CONSTRAINT allocations_investment_account_id_fkey 
FOREIGN KEY (investment_account_id) 
REFERENCES public.investment_accounts(id) 
ON DELETE CASCADE;