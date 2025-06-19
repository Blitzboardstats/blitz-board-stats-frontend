import { supabase, clearStaleSession } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types/userTypes';
import { mapRoleForDatabase } from '@/utils/userMapping';

// Track logout state to prevent multiple concurrent logout attempts
let isLoggingOut = false;

export const authService = {
  async login(email: string, password: string): Promise<void> {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    
    // Clear any stale session data first
    await clearStaleSession();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error);
      throw new Error(error.message);
    }
    
    console.log('Login successful');
  },

  async signup(email: string, password: string, role: UserRole = 'parent', metadata?: any): Promise<void> {
    console.log('=== SIGNUP PROCESS START ===');
    console.log('Signup data:', { email, role, metadata });
    
    try {
      // Validate inputs
      if (!email?.trim()) throw new Error('Email is required');
      if (!password) throw new Error('Password is required');
      if (password.length < 6) throw new Error('Password must be at least 6 characters');

      const dbRole = mapRoleForDatabase(role);
      
      // Prepare user metadata
      const userMetadata = {
        role: dbRole,
        ...metadata
      };

      console.log('Creating user with metadata:', userMetadata);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: userMetadata
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Failed to create user account');
      }

      console.log('Signup successful:', data.user.email);
      
    } catch (error: any) {
      console.error('Signup process error:', error);
      
      if (error.message?.includes('already registered')) {
        throw new Error('An account with this email already exists. Please try logging in instead.');
      } else if (error.message?.includes('Invalid email')) {
        throw new Error('Please enter a valid email address.');
      } else if (error.message?.includes('Password should be at least')) {
        throw new Error('Password must be at least 6 characters long.');
      } else {
        throw error;
      }
    }
  },

  async logout(): Promise<void> {
    console.log('=== LOGOUT PROCESS START ===');
    
    // Prevent multiple concurrent logout attempts
    if (isLoggingOut) {
      console.log('Logout already in progress, ignoring duplicate call');
      return;
    }
    
    isLoggingOut = true;
    
    try {
      // First, check for active session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.warn('Session check error before logout:', sessionError);
        // Continue with cleanup even if session check fails
      }
      
      if (!session) {
        console.log('No active session found, cleaning up local storage');
        await clearStaleSession();
        return;
      }
      
      console.log('Active session found, proceeding with logout');
      
      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        
        // Handle specific error cases
        if (error.message?.includes('session_not_found') || 
            error.message?.includes('Session not found') ||
            error.status === 403) {
          console.log('Session already invalidated, cleaning up local storage');
          await clearStaleSession();
          return;
        }
        
        // For other errors, still clean up local state
        console.warn('Logout failed, cleaning up local storage anyway');
        await clearStaleSession();
        return;
      }
      
      console.log('Logout successful');
      
    } catch (error: any) {
      console.error('Logout process error:', error);
      // Always try to clean up local storage
      await clearStaleSession();
    } finally {
      isLoggingOut = false;
    }
  },

  async updateProfile(user: User, updatedUser: Partial<User>): Promise<void> {
    try {
      console.log('Updating profile:', updatedUser);
      
      const dbRole = updatedUser.role ? mapRoleForDatabase(updatedUser.role) : undefined;
      
      // Update user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          display_name: updatedUser.name,
          role: dbRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }
      
      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: updatedUser
      });
      
      if (authError) {
        console.error('Auth update error:', authError);
        throw authError;
      }
      
      console.log('Profile updated successfully');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};
