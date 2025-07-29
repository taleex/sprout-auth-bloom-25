import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from '@/hooks/useTheme';

export const ThemeSettings: React.FC = () => {
  const { theme, isSystemTheme } = useTheme();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Appearance</h3>
            <p className="text-sm text-muted-foreground">
              Choose your preferred theme or use system setting
            </p>
          </div>
          <ThemeToggle />
        </div>
        
        <div className="text-sm text-muted-foreground">
          Current theme: <span className="font-medium capitalize">{theme}</span>
          {isSystemTheme && ' (following system preference)'}
        </div>
      </CardContent>
    </Card>
  );
};