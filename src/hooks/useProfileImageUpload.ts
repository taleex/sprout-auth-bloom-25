import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useProfileImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadProfileImage = async (file: File) => {
    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate file
      const maxSize = 2 * 1024 * 1024; // 2MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      
      if (file.size > maxSize) {
        throw new Error('File size must be less than 2MB');
      }
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPG, PNG, and WebP files are supported');
      }

      // Delete existing profile image if it exists
      const { data: existingFiles } = await supabase.storage
        .from('profile-images')
        .list(user.id);

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map(file => `${user.id}/${file.name}`);
        await supabase.storage
          .from('profile-images')
          .remove(filesToDelete);
      }

      // Upload new image
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      toast({
        title: "Profile image updated",
        description: "Your profile image has been successfully uploaded",
        variant: "success",
      });

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadProfileImage,
    isUploading,
  };
};