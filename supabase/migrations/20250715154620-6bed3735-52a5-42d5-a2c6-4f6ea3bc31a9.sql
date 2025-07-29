-- Add theme preference to user_preferences table
ALTER TABLE public.user_preferences 
ADD COLUMN theme_preference TEXT NOT NULL DEFAULT 'system' 
CHECK (theme_preference IN ('light', 'dark', 'system'));