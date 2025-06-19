
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';

interface PlayerTeam {
  id: string;
  name: string;
  age_group?: string;
  football_type?: string;
  season?: string;
  relationship_status?: 'active' | 'inactive' | 'transferred';
  joined_at?: string;
  left_at?: string;
}

export const usePlayerTeams = (playerId?: string) => {
  const [playerTeams, setPlayerTeams] = useState<PlayerTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlayerTeams = async () => {
      if (!user) {
        setPlayerTeams([]);
        setIsLoading(false);
        return;
      }

      console.log('usePlayerTeams: Fetching teams for user role:', user.role);
      setIsLoading(true);
      
      try {
        let teams: PlayerTeam[] = [];

        // For players: get teams through player_team_relationships
        if (user.role === 'player') {
          console.log('usePlayerTeams: Fetching teams for player via relationships');
          
          // First, try to get teams through the new relationship table using user_id
          const { data: relationshipTeams, error: relationshipError } = await supabase
            .from('player_team_relationships')
            .select(`
              status,
              joined_at,
              left_at,
              team:teams (
                id,
                name,
                age_group,
                football_type,
                season
              ),
              player:players!inner (
                user_id
              )
            `)
            .eq('players.user_id', user.id)
            .eq('status', 'active');

          if (!relationshipError && relationshipTeams && relationshipTeams.length > 0) {
            console.log('usePlayerTeams: Found teams via player relationships:', relationshipTeams);
            
            teams = relationshipTeams
              .filter(rel => rel.team)
              .map(rel => ({
                ...rel.team,
                relationship_status: rel.status as 'active' | 'inactive' | 'transferred',
                joined_at: rel.joined_at,
                left_at: rel.left_at
              })) as PlayerTeam[];
          } else {
            // Fallback: get teams via direct player records (legacy support)
            const { data: playerRecords, error: playerError } = await supabase
              .from('players')
              .select(`
                team_id,
                teams!inner(
                  id,
                  name,
                  age_group,
                  football_type,
                  season
                )
              `)
              .eq('user_id', user.id)
              .not('team_id', 'is', null);

            if (!playerError && playerRecords && playerRecords.length > 0) {
              console.log('usePlayerTeams: Found teams via direct player records:', playerRecords);
              teams = playerRecords.map(pr => pr.teams) as PlayerTeam[];
            }
          }
        }
        
        // For specific playerId lookup (used by other components)
        else if (playerId) {
          console.log('usePlayerTeams: Fetching teams for specific player ID:', playerId);
          
          // Try relationship table first
          const { data: relationshipTeams, error: relationshipError } = await supabase
            .from('player_team_relationships')
            .select(`
              status,
              joined_at,
              left_at,
              team:teams (
                id,
                name,
                age_group,
                football_type,
                season
              )
            `)
            .eq('player_id', playerId)
            .eq('status', 'active');

          if (!relationshipError && relationshipTeams && relationshipTeams.length > 0) {
            console.log('usePlayerTeams: Found teams via relationships for player:', playerId);
            
            teams = relationshipTeams
              .filter(rel => rel.team)
              .map(rel => ({
                ...rel.team,
                relationship_status: rel.status as 'active' | 'inactive' | 'transferred',
                joined_at: rel.joined_at,
                left_at: rel.left_at
              })) as PlayerTeam[];
          } else {
            // Fallback to legacy method
            const { data: playerDetails, error: detailsError } = await supabase
              .from('players')
              .select('name, guardian_email, team_id, teams(id, name, age_group, football_type, season)')
              .eq('id', playerId)
              .single();

            if (!detailsError && playerDetails) {
              if (playerDetails.teams) {
                teams = [playerDetails.teams as PlayerTeam];
              } else {
                // Search for matching players across all teams
                const { data: allMatchingPlayers, error: matchingError } = await supabase
                  .from('players')
                  .select(`
                    team_id,
                    teams (
                      id,
                      name,
                      age_group,
                      football_type,
                      season
                    )
                  `)
                  .eq('name', playerDetails.name)
                  .eq('guardian_email', playerDetails.guardian_email);

                if (!matchingError && allMatchingPlayers) {
                  const uniqueTeams = allMatchingPlayers
                    ?.filter(p => p.teams)
                    .map(p => p.teams)
                    .filter((team, index, self) => 
                      team && self.findIndex(t => t && t.id === team.id) === index
                    ) || [];
                  
                  teams = uniqueTeams as PlayerTeam[];
                }
              }
            }
          }
        }

        console.log('usePlayerTeams: Final teams found:', teams.length);
        setPlayerTeams(teams);
      } catch (error) {
        console.error('usePlayerTeams: Error in fetchPlayerTeams:', error);
        setPlayerTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerTeams();
  }, [user, playerId]);

  return { playerTeams, isLoading };
};
