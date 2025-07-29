-- Add columns to track sold assets and active status
ALTER TABLE public.allocations 
ADD COLUMN sold_date DATE,
ADD COLUMN sold_price NUMERIC,
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Update existing allocations to be active
UPDATE public.allocations 
SET is_active = true 
WHERE is_active IS NULL;

-- Make is_active NOT NULL after setting defaults
ALTER TABLE public.allocations 
ALTER COLUMN is_active SET NOT NULL;

-- Create index for better performance on active allocations
CREATE INDEX IF NOT EXISTS idx_allocations_active 
ON public.allocations (investment_account_id, is_active);

-- Create a function to validate total allocation percentage
CREATE OR REPLACE FUNCTION validate_allocation_percentage()
RETURNS TRIGGER AS $$
DECLARE
    total_percentage NUMERIC;
BEGIN
    -- Calculate total percentage for active allocations in the investment account
    SELECT COALESCE(SUM(percentage), 0) INTO total_percentage
    FROM public.allocations 
    WHERE investment_account_id = NEW.investment_account_id 
    AND is_active = true
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
    
    -- Add the new/updated allocation percentage
    total_percentage := total_percentage + NEW.percentage;
    
    -- Allow slight overages (up to 100.1% for rounding)
    IF total_percentage > 100.1 THEN
        RAISE EXCEPTION 'Total allocation percentage (%.2f%%) cannot exceed 100%% for investment account', total_percentage;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate allocation percentages
CREATE TRIGGER validate_allocation_percentage_trigger
    BEFORE INSERT OR UPDATE ON public.allocations
    FOR EACH ROW
    WHEN (NEW.is_active = true)
    EXECUTE FUNCTION validate_allocation_percentage();