
import { useBillsCrud } from './useBillsCrud';
import { useBillsState } from './useBillsState';
import { useBillsNotifications } from './useBillsNotifications';
import { Bill } from '@/types/bills';

// Track ongoing operations to prevent duplicate operations
const operationTracker = new Set<string>();

export const useBillsManager = () => {
  const { addBill: addBillCrud, updateBill: updateBillCrud, deleteBill: deleteBillCrud } = useBillsCrud();
  const { bills, isLoading, addBillToState, updateBillInState, removeBillFromState, refetch } = useBillsState();
  const {
    notifyBillAdded,
    notifyBillUpdated,
    notifyBillDeleted,
    notifyAddError,
    notifyUpdateError,
    notifyDeleteError,
  } = useBillsNotifications();

  const addBill = async (billData: Partial<Bill>) => {
    const operationKey = `add-${Date.now()}`;
    
    if (operationTracker.has(operationKey)) return;
    operationTracker.add(operationKey);

    try {
      const newBill = await addBillCrud(billData);
      addBillToState(newBill);
      notifyBillAdded();
    } catch (error) {
      console.error('Error adding bill:', error);
      notifyAddError();
    } finally {
      operationTracker.delete(operationKey);
    }
  };

  const updateBill = async (id: string, updates: Partial<Bill>) => {
    const operationKey = `update-${id}`;
    
    if (operationTracker.has(operationKey)) return;
    operationTracker.add(operationKey);

    try {
      const updatedBill = await updateBillCrud(id, updates);
      updateBillInState(id, updatedBill);
      notifyBillUpdated();
    } catch (error) {
      console.error('Error updating bill:', error);
      notifyUpdateError();
    } finally {
      operationTracker.delete(operationKey);
    }
  };

  const deleteBill = async (id: string) => {
    const operationKey = `delete-${id}`;
    
    if (operationTracker.has(operationKey)) return;
    operationTracker.add(operationKey);

    try {
      await deleteBillCrud(id);
      removeBillFromState(id);
      notifyBillDeleted();
    } catch (error) {
      console.error('Error deleting bill:', error);
      notifyDeleteError();
    } finally {
      operationTracker.delete(operationKey);
    }
  };

  return {
    bills,
    isLoading,
    addBill,
    updateBill,
    deleteBill,
    refetch,
  };
};
