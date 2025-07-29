import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseRealTimeUpdatesProps {
  table: string;
  onUpdate?: () => void;
  enabled?: boolean;
}

export const useRealTimeUpdates = ({ 
  table, 
  onUpdate, 
  enabled = true 
}: UseRealTimeUpdatesProps) => {
  const handleRealtimeUpdate = useCallback(() => {
    if (onUpdate) {
      onUpdate();
    }
  }, [onUpdate]);

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        () => {
          handleRealtimeUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, handleRealtimeUpdate, enabled]);

  return { isConnected: enabled };
};