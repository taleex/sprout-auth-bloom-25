
-- Add account selection requirement and better date handling for bills
-- The account_id field already exists but let's make sure it's properly set up
-- Add a specific_day field for monthly/yearly recurring patterns

ALTER TABLE public.bills 
ADD COLUMN IF NOT EXISTS specific_day integer CHECK (specific_day >= 1 AND specific_day <= 31);

-- Update the comment to clarify the specific_day usage
COMMENT ON COLUMN public.bills.specific_day IS 'Day of month for monthly bills (1-31) or day of year for yearly bills';

-- Make account_id required for bills that affect account balances
-- We'll handle this in the application logic rather than database constraint
-- to allow flexibility for bills that don't affect accounts directly
