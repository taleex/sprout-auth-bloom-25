
-- Fix the bills table to allow nullable account_id since bills don't always need to be tied to a specific account
ALTER TABLE public.bills ALTER COLUMN account_id DROP NOT NULL;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own bills" ON public.bills;
DROP POLICY IF EXISTS "Users can insert their own bills" ON public.bills;
DROP POLICY IF EXISTS "Users can update their own bills" ON public.bills;
DROP POLICY IF EXISTS "Users can delete their own bills" ON public.bills;

-- Policy to allow users to view their own bills
CREATE POLICY "Users can view their own bills" 
ON public.bills 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy to allow users to insert their own bills
CREATE POLICY "Users can insert their own bills" 
ON public.bills 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own bills
CREATE POLICY "Users can update their own bills" 
ON public.bills 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy to allow users to delete their own bills (soft delete by setting is_active = false)
CREATE POLICY "Users can delete their own bills" 
ON public.bills 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger to automatically update the updated_at timestamp (only if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_bills_updated_at ON public.bills;
CREATE TRIGGER update_bills_updated_at 
BEFORE UPDATE ON public.bills 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
