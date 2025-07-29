-- Create storage bucket for transaction imports
INSERT INTO storage.buckets (id, name, public) 
VALUES ('transaction-imports', 'transaction-imports', false);

-- Create storage policies for transaction import files
CREATE POLICY "Users can upload their own transaction files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'transaction-imports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own transaction files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'transaction-imports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own transaction files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'transaction-imports' AND auth.uid()::text = (storage.foldername(name))[1]);