
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Team } from '@/types/teamTypes';

export const useCoachTeams = () => {
  const [coachTeams, setCoachTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoachTeams = useCallback(async (userId: string, userEmail?: string) => {
    console.log("Fetching coach teams for user:", userId, "email:", userEmail);
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: coachTeamsByUserId, error: coachUserIdError } = await supabase
        .from('team_coaches')
        .select('team_id')
        .eq('user_id', userId);
      
      if (coachUserIdError) {
        console.error("Error fetching coach teams by user_id:", coachUserIdError);
      }

      let coachTeamsByEmail: any[] = [];
      if (userEmail) {
        const { data: coachEmailData, error: coachEmailError } = await supabase
          .from('team_coaches')
          .select('team_id')
          .eq('email', userEmail);
        
        if (coachEmailError) {
          console.error("Error fetching coach teams by email:", coachEmailError);
        } else {
          coachTeamsByEmail = coachEmailData || [];
        }
      }

      const allCoachTeamIds = [
        ...(coachTeamsByUserId || []).map(c => c.team_id),
        ...coachTeamsByEmail.map(c => c.team_id)
      ];
      
      const uniqueCoachTeamIds = [...new Set(allCoachTeamIds)];
      
      console.log("Coach team IDs fetched:", uniqueCoachTeamIds.length);

      let coachTeams: Team[] = [];
      if (uniqueCoachTeamIds.length > 0) {
        const { data: coachTeamsData, error: coachTeamsError } = await supabase
          .from('teams')
          .select(`
            *, 
            players(*)
          `)
          .in('id', uniqueCoachTeamIds);
        
        if (coachTeamsError) {
          console.error("Error fetching coach teams:", coachTeamsError);
        } else {
          // Type assertion to ensure football_type is properly typed
          coachTeams = (coachTeamsData || []).map(team => ({
            ...team,
            football_type: team.football_type as 'Tackle' | 'Flag'
          })) as Team[];
          
          console.log("Coach teams fetched successfully:", coachTeams.length);
        }
      }

      setCoachTeams(coachTeams);
      return coachTeams;
    } catch (err: any) {
      console.error("Error fetching coach teams:", err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    coachTeams,
    isLoading,
    error,
    fetchCoachTeams
  };
};
