
import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Camera } from 'lucide-react';
import { useProfileImageUpload } from '@/hooks/useProfileImageUpload';

interface ProfileImageUploadProps {
  fullName?: string;
  currentImageUrl?: string;
  onImageUploaded?: (url: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  fullName,
  currentImageUrl,
  onImageUploaded
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadProfileImage, isUploading } = useProfileImageUpload();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadProfileImage(file);
    if (uploadedUrl && onImageUploaded) {
      onImageUploaded(uploadedUrl);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-start gap-6">
      <div className="relative group">
        <Avatar className="h-24 w-24 border-4 border-finapp-accent/20">
          <AvatarImage src={currentImageUrl} />
          <AvatarFallback className="bg-gradient-to-br from-finapp-accent to-primary text-black text-2xl font-bold">
            {fullName ? getInitials(fullName) : 'PN'}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={handleUploadClick}>
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <div className="flex-1 space-y-3">
        <div>
          <Label className="text-sm font-medium text-foreground">Profile Photo</Label>
          <p className="text-xs text-muted-foreground mt-1">
            This will be displayed on your profile and throughout the app
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex items-center gap-2 border border-finapp-border hover:bg-finapp-muted rounded-xl h-9"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Supported formats: JPG, PNG, WebP (max 2MB). Square images work best.
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ProfileImageUpload;
