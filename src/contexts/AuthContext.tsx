import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, AuthError } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at?: string;
  user_metadata?: Record<string, unknown>;
}

interface AuthResponse {
  data: any;
  error: AuthError | null;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (password: string) => Promise<AuthResponse>;
  verifyOtp: (email: string, token: string) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else if (mounted) {
          setSession(session);
          setUser(session?.user ? {
            id: session.user.id,
            email: session.user.email || '',
            email_confirmed_at: session.user.email_confirmed_at,
            user_metadata: session.user.user_metadata
          } : null);
        }
      } catch (error) {
        console.error('Session error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ? {
            id: session.user.id,
            email: session.user.email || '',
            email_confirmed_at: session.user.email_confirmed_at,
            user_metadata: session.user.user_metadata
          } : null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }, []);

  const updatePassword = useCallback(async (password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }, []);

  const contextValue = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    verifyOtp,
  }), [user, session, loading, signUp, signIn, signInWithGoogle, signOut, resetPassword, updatePassword, verifyOtp]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};