
import { useBillsManager } from './useBillsManager';
import { Bill } from '@/types/bills';

export const useBillsData = () => {
  return useBillsManager();
};
