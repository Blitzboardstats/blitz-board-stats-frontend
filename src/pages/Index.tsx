import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Wait for auth to load before deciding where to redirect
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-blitz-charcoal'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blitz-purple mx-auto mb-4'></div>
          <p className='text-white'>Loading Blitz Board Stats...</p>
        </div>
      </div>
    );
  }

  // Redirect based on auth status
  return <Navigate to={isAuthenticated ? "/teams" : "/login"} replace />;
};

export default Index;
