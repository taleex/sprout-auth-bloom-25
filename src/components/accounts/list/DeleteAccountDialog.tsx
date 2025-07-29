
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteAccountDialogProps {
  accountId: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: (accountId: string) => void;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({ 
  accountId, 
  onOpenChange, 
  onConfirmDelete 
}) => {
  return (
    <AlertDialog open={!!accountId} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will archive this account. It will no longer appear in your accounts list or balance calculations.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (accountId) {
                onConfirmDelete(accountId);
              }
            }}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;
