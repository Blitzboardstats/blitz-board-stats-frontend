
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { GroupedPlayer, GuardianPlayersGroup, TeamInfo } from '@/types/groupedPlayerTypes';

export const useGuardianPlayersGrouped = () => {
  const { user } = useAuth();
  const [guardianPlayersGroup, setGuardianPlayersGroup] = useState<GuardianPlayersGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) {
      setGuardianPlayersGroup(null);
      setIsLoading(false);
      return;
    }

    const fetchGuardianPlayersGrouped = async () => {
      console.log('useGuardianPlayersGrouped: Fetching grouped players for guardian:', user.email);
      
      try {
        // Fetch all players for this guardian email across all teams
        const { data: playersData, error: playersError } = await supabase
          .from('players')
          .select(`
            id,
            name,
            team_id,
            guardian_email,
            guardian_name,
            jersey_number,
            position,
            photo_url,
            created_at,
            teams!inner (
              id,
              name,
              age_group
            )
          `)
          .eq('guardian_email', user.email);

        if (playersError) {
          console.error('useGuardianPlayersGrouped: Error fetching players:', playersError);
          setError('Failed to fetch guardian players');
          return;
        }

        if (!playersData || playersData.length === 0) {
          console.log('useGuardianPlayersGrouped: No players found for guardian:', user.email);
          setGuardianPlayersGroup({
            guardian_email: user.email,
            linked_players: []
          });
          return;
        }

        console.log('useGuardianPlayersGrouped: Found players:', playersData);

        // Group players by name and age group
        const groupedMap = new Map<string, GroupedPlayer>();

        playersData.forEach((player: any) => {
          const playerName = player.name;
          const ageGroup = player.teams?.age_group || 'Unknown';
          const groupKey = `${playerName}_${ageGroup}`;

          if (!groupedMap.has(groupKey)) {
            groupedMap.set(groupKey, {
              player_name: playerName,
              age_group: ageGroup,
              teams: [],
              player_ids: [],
              players: []
            });
          }

          const group = groupedMap.get(groupKey)!;
          
          // Add player ID
          group.player_ids.push(player.id);
          
          // Add player data
          group.players.push({
            id: player.id,
            name: player.name,
            team_id: player.team_id,
            guardian_email: player.guardian_email,
            guardian_name: player.guardian_name,
            jersey_number: player.jersey_number,
            position: player.position,
            photo_url: player.photo_url,
            created_at: player.created_at
          });

          // Add team info if not already present
          const teamExists = group.teams.some(team => team.team_id === player.teams.id);
          if (!teamExists && player.teams) {
            group.teams.push({
              team_id: player.teams.id,
              team_name: player.teams.name,
              age_group: player.teams.age_group
            });
          }
        });

        const guardianGroup: GuardianPlayersGroup = {
          guardian_email: user.email,
          linked_players: Array.from(groupedMap.values())
        };

        console.log('useGuardianPlayersGrouped: Grouped players result:', guardianGroup);
        setGuardianPlayersGroup(guardianGroup);

      } catch (error: any) {
        console.error('useGuardianPlayersGrouped: Error in fetchGuardianPlayersGrouped:', error);
        setError('Failed to load guardian players');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuardianPlayersGrouped();
  }, [user?.email]);

  return { 
    guardianPlayersGroup, 
    isLoading, 
    error,
    refreshData: () => {
      if (user?.email) {
        setIsLoading(true);
        setError(null);
      }
    }
  };
};
