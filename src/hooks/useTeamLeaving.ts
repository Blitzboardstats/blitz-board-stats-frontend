
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Team } from '@/types/teamTypes';

export const useTeamLeaving = () => {
  const [isLeaving, setIsLeaving] = useState(false);

  const leaveTeam = async (team: Team, userId: string): Promise<boolean> => {
    if (!userId) return false;
    
    setIsLeaving(true);
    try {
      // First, check if the user is a player by looking for player records
      const { data: playerRecords, error: playerError } = await supabase
        .from('players')
        .select('id')
        .eq('user_id', userId);

      if (playerError) {
        console.error("Error checking player records:", playerError);
        toast.error("Failed to check player status");
        return false;
      }

      // If user is a player, handle player-team relationships
      if (playerRecords && playerRecords.length > 0) {
        console.log("User is a player, deleting player-team relationships");
        
        const playerIds = playerRecords.map(p => p.id);
        
        // Delete player-team relationships
        const { error: relationshipError } = await supabase
          .from('player_team_relationships')
          .delete()
          .in('player_id', playerIds)
          .eq('team_id', team.id)
          .eq('status', 'active');

        if (relationshipError) {
          console.error("Error deleting player-team relationship:", relationshipError);
          toast.error("Failed to leave team");
          return false;
        }

        // Also remove from team_members table if they exist there
        const { error: memberError } = await supabase
          .from('team_members')
          .delete()
          .eq('team_id', team.id)
          .eq('user_id', userId);
        
        // Don't fail if team member removal fails - they might not be in that table
        if (memberError) {
          console.warn("Could not remove from team_members (non-critical):", memberError);
        }
      } else {
        // User is not a player, handle as regular team member
        console.log("User is not a player, removing from team members");
        
        const { error: memberError } = await supabase
          .from('team_members')
          .delete()
          .eq('team_id', team.id)
          .eq('user_id', userId);
        
        if (memberError) {
          console.error("Error removing team member:", memberError);
          toast.error("Failed to leave team");
          return false;
        }
      }
      
      // Update user_profiles.joined_teams for backward compatibility
      const { data: userProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('joined_teams')
        .eq('id', userId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Error fetching user profile:", fetchError);
      } else if (userProfile) {
        const updatedJoinedTeams = (userProfile.joined_teams || []).filter(id => id !== team.id);
        
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ joined_teams: updatedJoinedTeams })
          .eq('id', userId);
        
        if (updateError) {
          console.error("Error updating user profile:", updateError);
        }
      }
      
      toast.success("Left team successfully");
      return true;
    } catch (error: any) {
      console.error("Error leaving team:", error.message);
      toast.error("Failed to leave team");
      return false;
    } finally {
      setIsLeaving(false);
    }
  };

  return {
    leaveTeam,
    isLeaving
  };
};
