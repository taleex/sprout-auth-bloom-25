import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages
import Index from '@/pages/Index';
import Accounts from '@/pages/Accounts';
import Account from '@/pages/Account';
import Transactions from '@/pages/Transactions';
import TransactionForm from '@/pages/TransactionForm';
import TransactionDetail from '@/pages/TransactionDetail';
import Bills from '@/pages/Bills';
import Investments from '@/pages/Investments';
import Profile from '@/pages/Profile';
import AuthPage from '@/pages/auth/AuthPage';
import AuthCallbackPage from '@/pages/auth/AuthCallbackPage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  console.log('🚀 NEW App.tsx loaded - Fixed version with proper routing!');
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Auth routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
              <Route path="/accounts/:id" element={<ProtectedRoute><Account /></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
              <Route path="/transactions/new" element={<ProtectedRoute><TransactionForm /></ProtectedRoute>} />
              <Route path="/transactions/:id" element={<ProtectedRoute><TransactionDetail /></ProtectedRoute>} />
              <Route path="/transactions/:id/edit" element={<ProtectedRoute><TransactionForm /></ProtectedRoute>} />
              <Route path="/bills" element={<ProtectedRoute><Bills /></ProtectedRoute>} />
              <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;