
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useAccountDeletion } from '@/hooks/useAccountDeletion';

const ProfileAccountDeletion: React.FC = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const { deleteAccount, isLoading } = useAccountDeletion();

  const handleDeleteAccount = async () => {
    const success = await deleteAccount(deleteReason);
    if (success) {
      setShowDeleteDialog(false);
      setDeleteReason('');
    }
  };

  const handleCancel = () => {
    setShowDeleteDialog(false);
    setDeleteReason('');
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <p className="font-medium text-foreground">Delete Account</p>
          <p className="text-muted-foreground">Permanently remove your account and all data</p>
        </div>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-2xl h-9 px-4 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 text-left">
              <p><strong>Are you sure you want to delete your account?</strong></p>
              <p>This action is permanent and cannot be undone. All your data will be permanently removed from our servers.</p>
              <div className="space-y-3 mt-4">
                <Label htmlFor="delete-reason" className="text-sm font-medium">
                  Help us improve - Why are you leaving? (optional)
                </Label>
                <Textarea
                  id="delete-reason"
                  placeholder="What prompted your decision to delete your account?"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="min-h-[80px] border border-finapp-border rounded-2xl resize-none"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              onClick={handleCancel}
              disabled={isLoading}
              className="border border-finapp-border hover:bg-finapp-muted rounded-2xl"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white rounded-2xl"
            >
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileAccountDeletion;
