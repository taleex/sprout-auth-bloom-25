import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserPreferences {
  id: string;
  user_id: string;
  monthly_checkup_enabled: boolean;
  monthly_checkup_method: 'email' | 'app' | 'both';
  recurring_transactions_enabled: boolean;
  recurring_transactions_method: 'email' | 'app' | 'both';
  theme_preference: 'light' | 'dark' | 'system';
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Preferences don't exist, create default ones
        const { data: newPreferences, error: createError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            monthly_checkup_enabled: true,
            monthly_checkup_method: 'both',
            recurring_transactions_enabled: true,
            recurring_transactions_method: 'app',
            theme_preference: 'system'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating preferences:', createError);
          throw createError;
        }
        setPreferences(newPreferences as UserPreferences);
      } else if (error) {
        console.error('Error fetching preferences:', error);
        throw error;
      } else {
        setPreferences(data as UserPreferences);
      }
    } catch (error) {
      console.error('Error in fetchPreferences:', error);
      toast({
        title: "Error loading preferences",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setPreferences(data as UserPreferences);
      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved",
        variant: "success",
      });
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Update failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return {
    preferences,
    isLoading,
    updatePreferences,
    refetch: fetchPreferences,
  };
};