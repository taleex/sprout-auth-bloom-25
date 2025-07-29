import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OptimisticUpdateConfig<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useOptimisticUpdates = <T = any>() => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const executeUpdate = useCallback(async <TData = T>(
    optimisticUpdate: () => void,
    serverUpdate: () => Promise<TData>,
    revertUpdate: () => void,
    config?: OptimisticUpdateConfig<TData>
  ) => {
    setIsLoading(true);
    
    // Apply optimistic update immediately
    optimisticUpdate();

    try {
      const result = await serverUpdate();
      
      if (config?.successMessage) {
        toast({
          title: 'Success',
          description: config.successMessage,
        });
      }
      
      config?.onSuccess?.(result);
      return result;
    } catch (error) {
      // Revert optimistic update on error
      revertUpdate();
      
      const errorMessage = config?.errorMessage || 'An error occurred';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      
      config?.onError?.(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { executeUpdate, isLoading };
};

export default useOptimisticUpdates;