
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUserPreferences } from '@/hooks/useUserPreferences';

const NotificationSettings = () => {
  const { preferences, isLoading, updatePreferences } = useUserPreferences();

  const handleToggleNotification = (type: 'monthly_checkup' | 'recurring_transactions', enabled: boolean) => {
    updatePreferences({
      [`${type}_enabled`]: enabled
    });
  };

  const handleMethodChange = (type: 'monthly_checkup' | 'recurring_transactions', method: 'email' | 'app' | 'both') => {
    updatePreferences({
      [`${type}_method`]: method
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card shadow-sm border-border rounded-3xl">
          <CardContent className="p-6 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading preferences...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="space-y-6">
        <Card className="bg-card shadow-sm border-border rounded-3xl">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Unable to load preferences</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Monthly Account Checkup */}
      <Card className="bg-card shadow-sm border-border rounded-2xl sm:rounded-3xl">
        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
            Monthly Account Checkup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5 flex-1">
              <Label className="text-sm font-medium text-foreground">
                Enable monthly reminders
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Get reminded to review your account balances and transactions each month.
              </p>
            </div>
            <Switch
              checked={preferences.monthly_checkup_enabled}
              onCheckedChange={(enabled) => handleToggleNotification('monthly_checkup', enabled)}
            />
          </div>
          
          {preferences.monthly_checkup_enabled && (
            <div className="space-y-3 pt-3 sm:pt-4 border-t border-border">
              <Label className="text-xs sm:text-sm font-medium text-foreground">
                How would you like to receive these notifications?
              </Label>
              <RadioGroup 
                value={preferences.monthly_checkup_method} 
                onValueChange={(value) => handleMethodChange('monthly_checkup', value as 'email' | 'app' | 'both')}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="monthly-email" />
                  <Label htmlFor="monthly-email" className="text-xs sm:text-sm text-foreground">Email notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="app" id="monthly-app" />
                  <Label htmlFor="monthly-app" className="text-xs sm:text-sm text-foreground">In-app notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="monthly-both" />
                  <Label htmlFor="monthly-both" className="text-xs sm:text-sm text-foreground">Both email and in-app</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recurring Transactions */}
      <Card className="bg-card shadow-sm border-border rounded-2xl sm:rounded-3xl">
        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
            Recurring Transaction Confirmations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5 flex-1">
              <Label className="text-sm font-medium text-foreground">
                Enable transaction confirmations
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Get notified when recurring transactions are due and confirm before they affect your account balance.
              </p>
            </div>
            <Switch
              checked={preferences.recurring_transactions_enabled}
              onCheckedChange={(enabled) => handleToggleNotification('recurring_transactions', enabled)}
            />
          </div>
          
          {preferences.recurring_transactions_enabled && (
            <div className="space-y-3 pt-3 sm:pt-4 border-t border-border">
              <Label className="text-xs sm:text-sm font-medium text-foreground">
                How would you like to receive these notifications?
              </Label>
              <RadioGroup 
                value={preferences.recurring_transactions_method} 
                onValueChange={(value) => handleMethodChange('recurring_transactions', value as 'email' | 'app' | 'both')}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="recurring-email" />
                  <Label htmlFor="recurring-email" className="text-xs sm:text-sm text-foreground">Email notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="app" id="recurring-app" />
                  <Label htmlFor="recurring-app" className="text-xs sm:text-sm text-foreground">In-app notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="recurring-both" />
                  <Label htmlFor="recurring-both" className="text-xs sm:text-sm text-foreground">Both email and in-app</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-muted border-border rounded-2xl sm:rounded-3xl">
        <CardContent className="p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-foreground leading-relaxed">
            <strong>Note:</strong> Monthly checkup notifications are sent on the 1st of each month. 
            Recurring transaction notifications are sent when transactions are due based on their schedule.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
