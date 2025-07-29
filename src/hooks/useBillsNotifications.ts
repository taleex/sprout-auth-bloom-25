
import { useToast } from '@/hooks/use-toast';

export const useBillsNotifications = () => {
  const { toast } = useToast();

  const showSuccessToast = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "success",
    });
  };

  const showErrorToast = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  const notifyBillAdded = () => {
    showSuccessToast("Bill added", "New bill has been created successfully");
  };

  const notifyBillUpdated = () => {
    showSuccessToast("Bill updated", "Changes have been saved successfully");
  };

  const notifyBillDeleted = () => {
    showSuccessToast("Bill deleted", "Bill has been removed successfully");
  };

  const notifyAddError = () => {
    showErrorToast("Failed to add bill", "Please try again");
  };

  const notifyUpdateError = () => {
    showErrorToast("Failed to update bill", "Please try again");
  };

  const notifyDeleteError = () => {
    showErrorToast("Failed to delete bill", "Please try again");
  };

  return {
    notifyBillAdded,
    notifyBillUpdated,
    notifyBillDeleted,
    notifyAddError,
    notifyUpdateError,
    notifyDeleteError,
  };
};
