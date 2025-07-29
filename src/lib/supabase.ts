
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Use environment variables for configuration
// These values will be replaced by actual environment variables in production
// For development, they'll use the values from your Supabase project
const supabaseUrl = 'https://myrcukbpvjotrluvcige.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmN1a2JwdmpvdHJsdXZjaWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MTczMzYsImV4cCI6MjA2MjM5MzMzNn0.A6YxDzVUTLI6Lt2tC0vhxspY9UxXSMcSA1-TMWQyjAw';

// Create Supabase client with explicit configuration for auth persistence
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      storageKey: 'finapp-auth-token',
      flowType: 'pkce'
    }
  }
);

/**
 * Supabase Client
 * 
 * This client provides access to your Supabase database, authentication, and storage.
 * Import it in your components like:
 * import { supabase } from '@/lib/supabase';
 * 
 * You can then use it for:
 * - Authentication: supabase.auth.signIn(), supabase.auth.signOut()
 * - Database: supabase.from('profiles').select('*')
 * - Storage: supabase.storage.from('bucket').upload()
 */
