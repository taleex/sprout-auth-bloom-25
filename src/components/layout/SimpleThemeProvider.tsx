import React, { useEffect } from 'react';

interface SimpleThemeProviderProps {
  children: React.ReactNode;
}

export const SimpleThemeProvider: React.FC<SimpleThemeProviderProps> = ({ children }) => {
  useEffect(() => {
    // Simple system theme detection on mount
    const applySystemTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(isDark ? 'dark' : 'light');
    };

    // Apply initial theme
    applySystemTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applySystemTheme();
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return <>{children}</>;
};