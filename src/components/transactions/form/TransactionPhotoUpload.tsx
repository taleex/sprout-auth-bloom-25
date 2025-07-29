
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface TransactionPhotoUploadProps {
  photoFile: File | null;
  onPhotoChange: (file: File | null) => void;
}

export const TransactionPhotoUpload: React.FC<TransactionPhotoUploadProps> = ({
  photoFile,
  onPhotoChange,
}) => {
  return (
    <div className="space-y-2">
      <Label>Photo</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
        {photoFile ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{photoFile.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onPhotoChange(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label className="cursor-pointer">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Upload receipt or photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onPhotoChange(e.target.files[0])}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};
