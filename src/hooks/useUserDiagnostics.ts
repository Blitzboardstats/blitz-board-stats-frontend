
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserDiagnostics = () => {
  const diagnoseUser = useCallback(async (userEmail: string) => {
    console.log("=== USER DIAGNOSTICS START ===");
    console.log("Diagnosing user:", userEmail);
    
    try {
      // Check user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', userEmail);
      
      console.log("User profile:", userProfile, "Error:", profileError);
      
      // Check for players with this guardian email
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('id, name, guardian_email, team_id, teams(name)')
        .ilike('guardian_email', userEmail);
      
      console.log("Players with guardian email:", players, "Error:", playersError);
      
      // Check player guardians table
      if (userProfile && userProfile.length > 0) {
        const userId = userProfile[0].id;
        const { data: guardianships, error: guardianError } = await supabase
          .from('player_guardians')
          .select('*, players(name, team_id, teams(name))')
          .eq('guardian_user_id', userId);
        
        console.log("Guardian relationships:", guardianships, "Error:", guardianError);
        
        // Check team memberships
        const { data: memberships, error: memberError } = await supabase
          .from('team_members')
          .select('*, teams(name)')
          .eq('user_id', userId);
        
        console.log("Team memberships:", memberships, "Error:", memberError);
        
        // Check coach roles
        const { data: coachRoles, error: coachError } = await supabase
          .from('team_coaches')
          .select('*, teams(name)')
          .eq('user_id', userId);
        
        console.log("Coach roles:", coachRoles, "Error:", coachError);
        
        // Check created teams
        const { data: createdTeams, error: createdError } = await supabase
          .from('teams')
          .select('id, name')
          .eq('created_by', userId);
        
        console.log("Created teams:", createdTeams, "Error:", createdError);
      }
      
      console.log("=== USER DIAGNOSTICS END ===");
      
    } catch (error) {
      console.error("Diagnostic error:", error);
    }
  }, []);
  
  return { diagnoseUser };
};
