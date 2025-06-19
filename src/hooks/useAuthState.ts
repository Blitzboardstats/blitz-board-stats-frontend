
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, clearStaleSession } from '@/integrations/supabase/client';
import { User } from '@/types/userTypes';
import { mapSupabaseUser } from '@/utils/userMapping';
import { AuthState } from '@/types/authTypes';

export const useAuthState = (): AuthState & { error: string | null; retry: () => void } => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const isAdmin = user?.role === 'coach' || user?.role === 'assistant_coach';
  const isCoach = user?.role === 'coach' || user?.role === 'assistant_coach';
  const isAuthenticated = user !== null && session !== null;

  const retry = () => {
    console.log('useAuthState: Manual retry triggered');
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  const handleAuthStateChange = async (session: Session | null) => {
    console.log('useAuthState: Auth state change:', session?.user?.email || 'no session');
    setSession(session);
    setError(null);
    
    if (session?.user) {
      try {
        // Create enhanced user from session
        const enhancedUser = await mapSupabaseUser(session.user);
        setUser(enhancedUser);
        console.log('useAuthState: User set from session:', enhancedUser.email);
        
      } catch (error) {
        console.error('useAuthState: Error creating user from session:', error);
        
        // Create minimal fallback user
        const fallbackUser = {
          id: session.user.id,
          name: session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: 'parent' as const,
          team: 'Panthers',
        };
        setUser(fallbackUser);
        setError('Some profile data may not be available.');
      }
    } else {
      console.log('useAuthState: No session, clearing user');
      setUser(null);
      // Clear any stale session data when logged out
      await clearStaleSession();
    }
    
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;
    
    const initializeAuth = async () => {
      try {
        console.log('useAuthState: Initializing auth state');
        setLoading(true);
        setError(null);
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('useAuthState: Auth event:', event);
            if (mounted) {
              await handleAuthStateChange(session);
            }
          }
        );
        authSubscription = subscription;

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('useAuthState: Session check failed:', error);
          // Clear stale session on error
          await clearStaleSession();
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        console.log('useAuthState: Initial session:', session?.user?.email || 'no session');
        if (mounted) {
          await handleAuthStateChange(session);
        }

      } catch (initError) {
        console.error('useAuthState: Initialization failed:', initError);
        if (mounted) {
          setError('Failed to initialize authentication. Please refresh the page.');
          setLoading(false);
        }
      }
    };

    initializeAuth();
    
    // Cleanup timeout
    const cleanup = setTimeout(() => {
      if (mounted && loading) {
        console.warn('useAuthState: Cleanup timeout - assuming logged out');
        setLoading(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(cleanup);
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [retryCount]);

  console.log('useAuthState: Current state:', { 
    user: user?.email, 
    session: session ? 'exists' : 'none',
    loading, 
    isAuthenticated, 
    error 
  });

  return {
    user,
    session,
    loading,
    isAuthenticated,
    isAdmin,
    isCoach,
    error,
    retry,
  };
};
