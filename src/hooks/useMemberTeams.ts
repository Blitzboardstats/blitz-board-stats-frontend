
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Team } from '@/types/teamTypes';

export const useMemberTeams = () => {
  const [memberTeams, setMemberTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMemberTeams = useCallback(async (userId: string) => {
    console.log("Fetching team memberships for user:", userId);
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: membershipData, error: membershipError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', userId);
      
      if (membershipError) throw membershipError;

      console.log("Team memberships fetched successfully:", membershipData?.length || 0);
      
      let joinedTeams: Team[] = [];
      if (membershipData && membershipData.length > 0) {
        const teamIds = membershipData.map(m => m.team_id);
        
        console.log("Fetching joined teams data for team IDs:", teamIds);
        const { data: joinedTeamsData, error: joinedError } = await supabase
          .from('teams')
          .select(`
            *, 
            players(*)
          `)
          .in('id', teamIds);
        
        if (joinedError) throw joinedError;

        // Type assertion to ensure football_type is properly typed
        joinedTeams = (joinedTeamsData || []).map(team => ({
          ...team,
          football_type: team.football_type as 'Tackle' | 'Flag'
        })) as Team[];
        
        console.log("Joined teams fetched successfully:", joinedTeams.length);
      }

      setMemberTeams(joinedTeams);
      return joinedTeams;
    } catch (err: any) {
      console.error("Error fetching member teams:", err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    memberTeams,
    isLoading,
    error,
    fetchMemberTeams
  };
};
