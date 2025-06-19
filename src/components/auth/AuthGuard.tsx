import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContextOptimized";
import { useAuthStore } from "@/stores";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  console.log(`AuthGuard: checking auth state`, {
    isAuthenticated,
    isLoading,
    path: location.pathname,
  });

  // If we're still loading authentication data, show loading screen
  if (isLoading) {
    console.log("AuthGuard: Still loading auth, showing spinner");
    return (
      <div className='flex items-center justify-center min-h-screen bg-blitz-charcoal'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blitz-purple mx-auto mb-4'></div>
          <p className='text-white'>Authenticating...</p>
          <p className='text-gray-400 text-sm mt-2'>Verifying your access</p>
        </div>
      </div>
    );
  }

  // If not authenticated after loading is complete, redirect to login
  if (!isAuthenticated) {
    console.log("AuthGuard: Not authenticated, redirecting to login");
    return <Navigate to='/login' replace />;
  }

  console.log("AuthGuard: Authenticated, rendering protected content");
  return <>{children}</>;
};

export default AuthGuard;
