-- Add new fields to allocations table for proper investment tracking
ALTER TABLE public.allocations 
ADD COLUMN investment_start_date DATE,
ADD COLUMN purchase_price NUMERIC DEFAULT 0,
ADD COLUMN invested_amount NUMERIC DEFAULT 0;

-- Update existing allocations to have a default investment start date as creation date
UPDATE public.allocations 
SET investment_start_date = created_at::DATE
WHERE investment_start_date IS NULL;

-- Set purchase_price to initial_price for existing records
UPDATE public.allocations 
SET purchase_price = initial_price
WHERE purchase_price = 0;

-- Make investment_start_date NOT NULL after setting defaults
ALTER TABLE public.allocations 
ALTER COLUMN investment_start_date SET NOT NULL;

-- Add a constraint to ensure total percentage doesn't exceed 100% per investment account
-- This will be enforced at the application level since it needs complex logic

-- Create an index for better performance on investment account queries
CREATE INDEX IF NOT EXISTS idx_allocations_investment_account_date 
ON public.allocations (investment_account_id, investment_start_date);

-- Update the updated_at trigger to fire on the new columns
DROP TRIGGER IF EXISTS update_allocations_updated_at ON public.allocations;
CREATE TRIGGER update_allocations_updated_at
BEFORE UPDATE ON public.allocations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();