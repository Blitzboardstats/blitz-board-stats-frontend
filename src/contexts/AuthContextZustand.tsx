
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from '@/types/userTypes';
import { useAuth as useZustandAuth } from '@/hooks/useAuth';
import { useTermsAcceptance } from '@/hooks/useTermsAcceptance';
import ErrorBoundary from '@/components/auth/ErrorBoundary';
import TermsAcknowledgment from '@/components/auth/TermsAcknowledgment';

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
  console.log('AuthProvider (Zustand): Rendering');

  const authState = useZustandAuth();
  const { hasAcceptedTerms, isLoading: termsLoading, acceptTerms } = useTermsAcceptance();
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  // Map Zustand auth to the expected interface
  const contextValue: AuthContextType = {
    user: authState.user ? {
      ...authState.user,
      team: authState.user.team || 'Panthers' // Provide default team to satisfy required field
    } : null,
    session: authState.session, // Use the session directly from the hook
    loading: authState.loading,
    isAuthenticated: authState.isAuthenticated,
    isAdmin: authState.isAdmin,
    isCoach: authState.isCoach,
    login: authState.login,
    logout: authState.logout,
    signup: authState.signup,
    updateProfile: authState.updateProfile,
  };

  // Check if we need to show terms dialog for authenticated users
  useEffect(() => {
    if (!authState.loading && !termsLoading && authState.isAuthenticated && hasAcceptedTerms === false) {
      console.log('AuthProvider: Showing terms dialog for authenticated user');
      setShowTermsDialog(true);
    }
  }, [authState.loading, authState.isAuthenticated, termsLoading, hasAcceptedTerms]);

  const handleTermsAccept = () => {
    acceptTerms();
    setShowTermsDialog(false);
  };

  // Show error state if needed
  if (authState.error && !authState.loading) {
    console.log('AuthProvider (Zustand): Showing error state:', authState.error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-blitz-charcoal px-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-white mb-2">Connection Problem</h2>
          <p className="text-gray-300 mb-6">{authState.error}</p>
          <button
            onClick={authState.clearError}
            className="bg-blitz-purple hover:bg-blitz-purple/80 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (authState.loading || termsLoading) {
    console.log('AuthProvider (Zustand): Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen bg-blitz-charcoal">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blitz-purple mx-auto mb-4"></div>
          <p className="text-white">Loading Blitz Board Stats...</p>
        </div>
      </div>
    );
  }

  console.log('AuthProvider (Zustand): Rendering children with context');

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={contextValue}>
        {children}
        
        {/* Terms Acknowledgment Dialog */}
        {showTermsDialog && (
          <TermsAcknowledgment
            isOpen={showTermsDialog}
            onAccept={handleTermsAccept}
            userRole={authState.user?.role}
          />
        )}
      </AuthContext.Provider>
    </ErrorBoundary>
  );
};

export const useAuth = () => useContext(AuthContext);
