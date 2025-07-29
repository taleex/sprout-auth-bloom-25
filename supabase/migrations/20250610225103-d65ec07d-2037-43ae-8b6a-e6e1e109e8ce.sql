
-- Create the update_account_balance function
CREATE OR REPLACE FUNCTION public.update_account_balance(
  account_id uuid,
  amount_change numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.accounts
  SET 
    balance = balance + amount_change,
    updated_at = now()
  WHERE id = account_id;
END;
$$;
