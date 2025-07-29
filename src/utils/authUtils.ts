
// Utility functions for authentication

/**
 * Clean up any leftover auth state from localStorage and sessionStorage
 * Only cleans up if remember me is not enabled
 */
export const cleanupAuthState = () => {
  // Check if remember me is enabled
  const rememberMe = localStorage.getItem('finapp_remember_me') === 'true';
  
  // Only clean up if remember me is not enabled
  if (!rememberMe) {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

/**
 * Check if remember me is enabled
 */
export const isRememberMeEnabled = () => {
  return localStorage.getItem('finapp_remember_me') === 'true';
};
