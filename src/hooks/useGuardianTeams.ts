
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Team } from '@/types/teamTypes';

export const useGuardianTeams = () => {
  const [guardianTeams, setGuardianTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuardianTeams = useCallback(async (userEmail: string) => {
    console.log("Fetching guardian teams for user email:", userEmail);
    setIsLoading(true);
    setError(null);
    
    try {
      // First, get the user's profile to find their user_id
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        // Continue with email-based lookup as fallback
      }

      let guardianTeams: Team[] = [];

      // Method 1: Check player_guardians table for proper relationships
      if (userProfile?.id) {
        console.log("Checking player_guardians table for user:", userProfile.id);
        const { data: guardianRelationships, error: guardianError } = await supabase
          .from('player_guardians')
          .select(`
            player_id,
            players!fk_player_guardians_player_id(
              team_id,
              teams!inner(
                id,
                name,
                football_type,
                age_group,
                season,
                photo_url,
                logo_url,
                coach_id,
                created_by,
                created_at,
                wins,
                losses,
                draws,
                players(*)
              )
            )
          `)
          .eq('guardian_user_id', userProfile.id);

        if (guardianError) {
          console.error("Error fetching from player_guardians:", guardianError);
        } else if (guardianRelationships && guardianRelationships.length > 0) {
          const teamsFromGuardianship = guardianRelationships.map(rel => rel.players.teams);
          guardianTeams = teamsFromGuardianship.map(team => ({
            ...team,
            football_type: team.football_type as 'Tackle' | 'Flag'
          })) as Team[];
          console.log("Found teams through player_guardians:", guardianTeams.length);
        }
      }

      // Method 2: Fallback to email-based lookup if no guardian relationships found
      if (guardianTeams.length === 0) {
        console.log("No guardian relationships found, trying email-based lookup");
        const { data: teamsWithGuardianPlayers, error: guardianTeamsError } = await supabase
          .from('teams')
          .select(`
            id,
            name,
            football_type,
            age_group,
            season,
            photo_url,
            logo_url,
            coach_id,
            created_by,
            created_at,
            wins,
            losses,
            draws,
            players(*)
          `)
          .not('players', 'is', null);
        
        if (guardianTeamsError) {
          console.error("Error fetching teams with players:", guardianTeamsError);
          throw guardianTeamsError;
        }
        
        // Filter teams that have players with matching guardian email (case-insensitive)
        const filteredGuardianTeams = (teamsWithGuardianPlayers || []).filter(team => {
          const hasMatchingPlayer = team.players && team.players.some((player: any) => {
            const playerEmail = player.guardian_email?.toLowerCase().trim();
            const searchEmail = userEmail.toLowerCase().trim();
            console.log(`Checking player ${player.name} with guardian_email: "${playerEmail}" against user email: "${searchEmail}"`);
            return playerEmail === searchEmail;
          });
          if (hasMatchingPlayer) {
            console.log(`Found matching team: ${team.name} for guardian email: ${userEmail}`);
          }
          return hasMatchingPlayer;
        });
        
        guardianTeams = filteredGuardianTeams.map(team => ({
          ...team,
          football_type: team.football_type as 'Tackle' | 'Flag'
        })) as Team[];
      }

      // Method 3: Also check if this user created teams as a parent/guardian
      if (userProfile?.id) {
        console.log("Also checking teams created by this user");
        const { data: createdTeams, error: createdError } = await supabase
          .from('teams')
          .select(`
            id,
            name,
            football_type,
            age_group,
            season,
            photo_url,
            logo_url,
            coach_id,
            created_by,
            created_at,
            wins,
            losses,
            draws,
            players(*)
          `)
          .eq('created_by', userProfile.id);

        if (!createdError && createdTeams) {
          const typedCreatedTeams = createdTeams.map(team => ({
            ...team,
            football_type: team.football_type as 'Tackle' | 'Flag'
          })) as Team[];
          
          // Combine with guardian teams and remove duplicates
          const allTeams = [...guardianTeams, ...typedCreatedTeams];
          guardianTeams = allTeams.filter((team, index, self) => 
            index === self.findIndex(t => t.id === team.id)
          );
        }
      }
      
      console.log("Final guardian teams found:", guardianTeams.length, guardianTeams.map(t => t.name));
      setGuardianTeams(guardianTeams);
      return guardianTeams;
    } catch (err: any) {
      console.error("Error fetching guardian teams:", err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    guardianTeams,
    isLoading,
    error,
    fetchGuardianTeams
  };
};
