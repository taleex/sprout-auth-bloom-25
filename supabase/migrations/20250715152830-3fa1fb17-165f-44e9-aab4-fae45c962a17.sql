-- Create user preferences table for notification settings
CREATE TABLE public.user_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_checkup_enabled boolean NOT NULL DEFAULT true,
  monthly_checkup_method text NOT NULL DEFAULT 'both' CHECK (monthly_checkup_method IN ('email', 'app', 'both')),
  recurring_transactions_enabled boolean NOT NULL DEFAULT true,
  recurring_transactions_method text NOT NULL DEFAULT 'app' CHECK (recurring_transactions_method IN ('email', 'app', 'both')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own preferences"
  ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON public.user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
  ON public.user_preferences
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true);

-- Create storage policies for profile images
CREATE POLICY "Users can view profile images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own profile image"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile image"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile image"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);