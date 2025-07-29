import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePasswordChange = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const changePassword = async (newPassword: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated successfully",
        description: "Your password has been changed",
        variant: "success",
      });

      return true;
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: "Password change failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changePassword,
    isLoading,
  };
};