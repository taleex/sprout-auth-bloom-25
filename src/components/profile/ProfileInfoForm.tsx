
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfileData } from '@/hooks/useProfileData';
import { User, Mail, Edit3, Save, X } from 'lucide-react';

const ProfileInfoForm: React.FC = () => {
  const { profile, updateProfile } = useProfileData();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await updateProfile({
        full_name: formData.full_name.trim() || null,
        email: formData.email.trim() || null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      email: profile?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2 sm:space-y-3">
          <Label htmlFor="full_name" className="text-sm font-medium text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Full name
          </Label>
          {isEditing ? (
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter your full name"
              disabled={isUpdating}
              className="bg-background border border-border rounded-xl h-10 sm:h-11 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          ) : (
            <div className="bg-muted/50 border border-border rounded-xl h-10 sm:h-11 px-3 flex items-center text-foreground text-sm sm:text-base">
              {profile?.full_name || (
                <span className="text-muted-foreground italic">Not set</span>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2 sm:space-y-3">
          <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email address
          </Label>
          {isEditing ? (
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email address"
              disabled={isUpdating}
              className="bg-background border border-border rounded-xl h-10 sm:h-11 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          ) : (
            <div className="bg-muted/50 border border-border rounded-xl h-10 sm:h-11 px-3 flex items-center text-foreground text-sm sm:text-base">
              {profile?.email || (
                <span className="text-muted-foreground italic">Not set</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-border">
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 rounded-xl h-10 sm:h-11 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
              className="border border-border hover:bg-muted rounded-xl h-10 sm:h-11 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 rounded-xl h-10 sm:h-11 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Save className="h-4 w-4" />
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileInfoForm;
