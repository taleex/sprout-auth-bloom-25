import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useAccountDeletion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const deleteAccount = async (reason?: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Log the deletion reason if provided
      if (reason) {
        // In a real app, you might want to store this in a deletions table
      }

      // Delete user account
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;

      // Sign out and redirect
      await supabase.auth.signOut();
      
      toast({
        title: "Account deleted successfully",
        description: "Your account and all data have been permanently removed",
        variant: "default",
      });

      // Redirect to login page
      navigate('/auth');
      
      return true;
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Account deletion failed",
        description: error.message || "Please try again or contact support",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteAccount,
    isLoading,
  };
};