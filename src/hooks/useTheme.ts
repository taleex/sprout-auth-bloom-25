import { useEffect, useState } from 'react';
import { useUserPreferences } from './useUserPreferences';

export type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Function to get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Function to resolve theme based on preference
  const resolveTheme = (themePreference: Theme): 'light' | 'dark' => {
    if (themePreference === 'system') {
      return getSystemTheme();
    }
    return themePreference;
  };

  // Apply theme to document
  const applyTheme = (theme: 'light' | 'dark') => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      setResolvedTheme(theme);
    }
  };

  // Set theme preference and update database
  const setTheme = async (newTheme: Theme) => {
    try {
      // Update local state immediately for quick feedback
      setThemeState(newTheme);
      
      // Apply the resolved theme to document
      const resolved = resolveTheme(newTheme);
      applyTheme(resolved);
      
      // Update database if preferences are loaded
      if (preferences) {
        await updatePreferences({ theme_preference: newTheme });
      }
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  // Initialize theme from user preferences (only after they're loaded)
  useEffect(() => {
    if (preferences?.theme_preference) {
      const userTheme = preferences.theme_preference;
      setThemeState(userTheme);
      const resolved = resolveTheme(userTheme);
      applyTheme(resolved);
    } else {
      // Fallback to system theme if no preferences yet
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);
    }
  }, [preferences?.theme_preference]);

  // Listen for system theme changes when using system preference
  useEffect(() => {
    const currentTheme = preferences?.theme_preference || theme;
    
    if (currentTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
      };
      
      // Apply initial system theme
      applyTheme(getSystemTheme());
      
      // Listen for changes
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, [preferences?.theme_preference, theme]);

  return {
    theme: preferences?.theme_preference || theme,
    resolvedTheme,
    setTheme,
    isSystemTheme: (preferences?.theme_preference || theme) === 'system',
  };
};