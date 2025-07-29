-- Create table for storing user API keys
CREATE TABLE public.user_api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  service_name TEXT NOT NULL,
  api_key_encrypted TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, service_name)
);

-- Enable Row Level Security
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own API keys" 
ON public.user_api_keys 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys" 
ON public.user_api_keys 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys" 
ON public.user_api_keys 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys" 
ON public.user_api_keys 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_api_keys_updated_at
BEFORE UPDATE ON public.user_api_keys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to encrypt API keys (simple base64 encoding for this example)
CREATE OR REPLACE FUNCTION public.encrypt_api_key(api_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Simple base64 encoding (in production, use proper encryption)
  RETURN encode(api_key::bytea, 'base64');
END;
$$;

-- Create function to decrypt API keys
CREATE OR REPLACE FUNCTION public.decrypt_api_key(encrypted_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Simple base64 decoding (in production, use proper decryption)
  RETURN convert_from(decode(encrypted_key, 'base64'), 'UTF8');
END;
$$;