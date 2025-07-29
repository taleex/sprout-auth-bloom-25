
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/SimpleAuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Determine if the current route is an auth route
  const isAuthRoute = 
    location.pathname === '/auth' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password' ||
    location.pathname === '/auth/callback';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
          <svg 
            className="animate-spin h-8 w-8 text-muted-foreground" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  if (!user) {
    // If not authenticated and not on an auth route, redirect to login
    if (!isAuthRoute) {
      return <Navigate to="/auth?view=login" replace />;
    }
  } else {
    // If authenticated and on an auth route, redirect to home
    if (isAuthRoute) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
