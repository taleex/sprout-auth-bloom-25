
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { usePasswordChange } from '@/hooks/usePasswordChange';

const ProfilePasswordSection: React.FC = () => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const { changePassword, isLoading } = usePasswordChange();

  const handlePasswordChange = async () => {
    if (!newPassword.trim()) return;
    
    const success = await changePassword(newPassword);
    if (success) {
      setShowPasswordDialog(false);
      setNewPassword('');
    }
  };

  const handleCancel = () => {
    setShowPasswordDialog(false);
    setNewPassword('');
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <p className="font-medium text-foreground">Password</p>
          <p className="text-muted-foreground">Last updated 30 days ago</p>
        </div>
      </div>
      
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogTrigger asChild>
          <Button className="bg-black hover:bg-gray-800 text-white rounded-2xl h-9 px-4 flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            Change Password
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your new password below. Make sure it's strong and secure.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password *</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="border border-finapp-border rounded-2xl h-11 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="border border-finapp-border hover:bg-finapp-muted rounded-2xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              disabled={isLoading || !newPassword.trim()}
              className="bg-black hover:bg-gray-800 text-white rounded-2xl"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePasswordSection;
