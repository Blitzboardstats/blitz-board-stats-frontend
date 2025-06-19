
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useJoinedTeams = (userId: string | undefined) => {
  const [joinedTeams, setJoinedTeams] = useState<string[]>([]);

  useEffect(() => {
    if (userId) {
      fetchJoinedTeams();
    }
  }, [userId]);

  const fetchJoinedTeams = async () => {
    if (!userId) return;

    try {
      console.log('Fetching joined teams for user:', userId);
      
      // Fetch from team_members table as primary source
      const { data: memberData, error: memberError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', userId);

      if (memberError) throw memberError;

      const memberTeamIds = memberData?.map(m => m.team_id) || [];
      console.log('Member team IDs:', memberTeamIds);

      // Also check user_profiles for backward compatibility
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('joined_teams')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      }

      const profileTeamIds = profileData?.joined_teams || [];
      console.log('Profile team IDs:', profileTeamIds);
      
      // Combine both sources and remove duplicates
      const allJoinedTeams = [...new Set([...memberTeamIds, ...profileTeamIds])];
      console.log('All joined teams:', allJoinedTeams);
      setJoinedTeams(allJoinedTeams);
    } catch (error) {
      console.error('Error fetching joined teams:', error);
    }
  };

  const joinTeam = async (teamId: string) => {
    if (!userId) {
      toast.error('You must be logged in to join a team');
      return;
    }

    try {
      // Add to team_members table (primary source of truth)
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: userId
        });

      // Handle duplicate key error gracefully
      if (memberError && !memberError.message.includes('duplicate')) {
        throw memberError;
      }

      // Also update user_profiles for backward compatibility
      const currentJoinedTeams = [...joinedTeams];
      if (!currentJoinedTeams.includes(teamId)) {
        currentJoinedTeams.push(teamId);
        
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ joined_teams: currentJoinedTeams })
          .eq('id', userId);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          // Continue even if profile update fails since team_members is primary
        }
      }

      setJoinedTeams(currentJoinedTeams);
      toast.success('Successfully joined the team!');
    } catch (error: any) {
      console.error('Error joining team:', error);
      toast.error('Failed to join team');
    }
  };

  return {
    joinedTeams,
    joinTeam,
    refetchJoinedTeams: fetchJoinedTeams
  };
};
