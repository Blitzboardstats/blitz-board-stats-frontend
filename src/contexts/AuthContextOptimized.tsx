import React, { createContext, useContext } from "react";
import { AuthContextType } from "@/types/userTypes";
import { useAuthState } from "@/hooks/useAuthState";
import { authService } from "@/services/authService";
import ErrorBoundary from "@/components/auth/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  isCoach: false,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("AuthProvider: Rendering");

  const authState = useAuthState();

  const updateProfile = async (updatedUser: Partial<typeof authState.user>) => {
    if (!authState.user) {
      return Promise.reject(new Error("No user logged in"));
    }

    await authService.updateProfile(authState.user, updatedUser);
  };

  const logout = async () => {
    await authService.logout();
  };

  const contextValue: AuthContextType = {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    isAuthenticated: authState.isAuthenticated,
    isAdmin: authState.isAdmin,
    isCoach: authState.isCoach,
    login: authService.login,
    logout,
    signup: authService.signup,
    updateProfile,
  };

  // Show error state with retry option
  if (authState.error && !authState.loading) {
    console.log("AuthProvider: Showing error state:", authState.error);
    return (
      <div
        className='flex items-center justify-center min-h-screen bg-blitz-charcoal px-4'
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          padding: "1rem",
        }}
      >
        <div className='text-center max-w-md'>
          <AlertCircle className='h-12 w-12 text-red-400 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-white mb-2'>
            Connection Problem
          </h2>
          <p className='text-gray-300 mb-6'>{authState.error}</p>
          <div className='space-y-3'>
            <Button
              onClick={authState.retry}
              className='w-full bg-blitz-purple hover:bg-blitz-purple/80'
              style={{ backgroundColor: "#8B5CF6" }}
            >
              <RefreshCw className='h-4 w-4 mr-2' />
              Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant='outline'
              className='w-full border-gray-600 text-gray-300 hover:bg-gray-800'
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (authState.loading) {
    console.log("AuthProvider: Showing loading state");
    return (
      <div
        className='flex items-center justify-center min-h-screen bg-blitz-charcoal'
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
        }}
      >
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blitz-purple mx-auto mb-4'></div>
          <p className='text-white'>Loading Blitz Board Stats...</p>
          <p className='text-gray-400 text-sm mt-2'>
            This should only take a few seconds
          </p>
        </div>
      </div>
    );
  }

  console.log("AuthProvider: Rendering children with context");

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    </ErrorBoundary>
  );
};

export const useAuth = () => useContext(AuthContext);
