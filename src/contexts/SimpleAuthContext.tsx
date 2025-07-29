import React from 'react';

interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at?: string;
  user_metadata?: Record<string, unknown>;
}

interface SimpleAuthContextType {
  user: AuthUser | null;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
  verifyOtp: (email: string, token: string) => Promise<any>;
}

// Mock user for testing
const mockUser: AuthUser = {
  id: 'mock-user-id',
  email: 'test@example.com',
  email_confirmed_at: new Date().toISOString(),
  user_metadata: {
    full_name: 'Test User',
    avatar_url: ''
  }
};

const SimpleAuthContext = React.createContext<SimpleAuthContextType>({
  user: mockUser,
  session: null,
  loading: false,
  signUp: async () => ({ data: null, error: null }),
  signIn: async () => ({ data: null, error: null }),
  signInWithGoogle: async () => ({ data: null, error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ data: null, error: null }),
  updatePassword: async () => ({ data: null, error: null }),
  verifyOtp: async () => ({ data: null, error: null }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('SimpleAuthProvider rendering - app should load now');
  
  return (
    <SimpleAuthContext.Provider value={{
      user: mockUser,
      session: null,
      loading: false,
      signUp: async () => ({ data: null, error: null }),
      signIn: async () => ({ data: null, error: null }),
      signInWithGoogle: async () => ({ data: null, error: null }),
      signOut: async () => {
        console.log('Mock signOut called');
      },
      resetPassword: async () => ({ data: null, error: null }),
      updatePassword: async () => ({ data: null, error: null }),
      verifyOtp: async () => ({ data: null, error: null }),
    }}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(SimpleAuthContext);
  return context;
};