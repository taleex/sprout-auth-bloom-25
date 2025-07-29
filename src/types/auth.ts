import { AuthError } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email?: string;
  full_name?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: any | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null; data: any }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: AuthError | null; data: any }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null; data: any }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null; data: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: AuthError | null; data: any }>;
}