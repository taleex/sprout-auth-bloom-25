import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfileData } from '@/hooks/useProfileData';
import ProfileImageUpload from './ProfileImageUpload';
import ProfileInfoForm from './ProfileInfoForm';
import ProfilePasswordSection from './ProfilePasswordSection';
import ProfileAccountDeletion from './ProfileAccountDeletion';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';

const ProfileForm = () => {
  const {
    profile,
    isLoading
  } = useProfileData();
  const {
    theme,
    setTheme
  } = useTheme();
  const isDarkMode = theme === 'dark' || theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const handleDarkModeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  if (isLoading) {
    return <Card className="bg-card shadow-sm border border-border rounded-3xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading profile...</p>
        </CardContent>
      </Card>;
  }

  return <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Profile Header Card */}
      <Card className="bg-card shadow-sm border border-border rounded-2xl sm:rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-1 sm:mb-2">
            Profile Information
          </CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </div>
        <CardContent className="p-4 sm:p-6 md:p-8">
          {/* Profile Image Section */}
          <div className="mb-6 sm:mb-8">
            <ProfileImageUpload 
              fullName={profile?.full_name || undefined} 
              currentImageUrl={undefined} 
              onImageUploaded={url => {
                // Image uploaded successfully
              }} 
            />
          </div>

          {/* Form Fields */}
          <ProfileInfoForm />
        </CardContent>
      </Card>

      {/* Settings Grid */}
      <div className="space-y-4 sm:space-y-6">
        {/* Dark Mode Settings */}
        <Card className="bg-card shadow-sm border border-border rounded-2xl sm:rounded-3xl">
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-primary/20 flex items-center justify-center">
                <div className="w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-primary"></div>
              </div>
              <span>Dark Mode</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <h3 className="font-medium text-foreground text-sm sm:text-base">Toggle dark mode</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={handleDarkModeToggle} />
            </div>
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card className="bg-card shadow-sm border border-border rounded-2xl sm:rounded-3xl">
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span>Security</span>
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground px-10 sm:px-13">
              Manage your password and account security
            </p>
          </CardHeader>
          <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
            <ProfilePasswordSection />
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="bg-card shadow-sm border border-border rounded-2xl sm:rounded-3xl">
        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-base sm:text-lg font-semibold text-red-600 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L5.18 14.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <span>Danger Zone</span>
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground px-10 sm:px-13">
            Irreversible actions that affect your account
          </p>
        </CardHeader>
        <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
          <ProfileAccountDeletion />
        </CardContent>
      </Card>
    </div>;
};

export default ProfileForm;
