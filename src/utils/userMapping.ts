
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from '@/types/userTypes';
import { supabase } from '@/integrations/supabase/client';

// Map UserRole to database-compatible role
export const mapRoleForDatabase = (role: UserRole): 'coach' | 'parent' | 'player' | 'fan' | 'referee' => {
  if (role === 'guardian') return 'parent';
  if (role === 'assistant_coach' || role === 'statistician') return 'coach';
  if (role === 'admin') return 'coach';
  if (['coach', 'parent', 'player', 'fan', 'referee'].includes(role)) {
    return role as 'coach' | 'parent' | 'player' | 'fan' | 'referee';
  }
  return 'parent';
};

// Fast mapping with aggressive timeout and fallback
export const mapSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  try {
    console.log('mapSupabaseUser: Starting fast user mapping for:', supabaseUser.email);
    
    // Create immediate fallback user
    const fallbackUser: User = {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      role: (supabaseUser.user_metadata?.role as UserRole) || 'parent',
      team: 'Panthers',
      phone: supabaseUser.user_metadata?.phoneNumber,
      phoneNumber: supabaseUser.user_metadata?.phoneNumber,
      avatar: supabaseUser.user_metadata?.avatar,
    };

    // Try to get profile with very short timeout
    try {
      const profilePromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 800); // Very short timeout
      });

      const { data: profile, error } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]) as any;

      if (!error && profile) {
        console.log('mapSupabaseUser: Successfully fetched profile quickly');
        return {
          id: supabaseUser.id,
          name: profile.display_name || fallbackUser.name,
          email: supabaseUser.email || '',
          role: profile.role as UserRole || fallbackUser.role,
          team: 'Panthers',
          phone: supabaseUser.user_metadata?.phoneNumber,
          phoneNumber: supabaseUser.user_metadata?.phoneNumber,
          avatar: supabaseUser.user_metadata?.avatar,
        };
      }
    } catch (profileError) {
      console.log('mapSupabaseUser: Profile fetch failed or timed out, using fallback');
    }

    console.log('mapSupabaseUser: Using fallback user data');
    return fallbackUser;

  } catch (error) {
    console.error('mapSupabaseUser: Critical error, using minimal user:', error);
    
    // Return absolute minimal safe user
    return {
      id: supabaseUser.id,
      name: supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      role: 'parent',
      team: 'Panthers',
    };
  }
};
