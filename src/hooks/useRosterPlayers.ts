
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/types/playerTypes';
import { toast } from 'sonner';

interface UseRosterPlayersProps {
  teamId: string;
  isActive: boolean; // Only fetch when roster tab is active
}

export const useRosterPlayers = ({ teamId, isActive }: UseRosterPlayersProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = async () => {
    if (!teamId || !isActive) return;

    console.log('useRosterPlayers: Starting fetch for team:', teamId);
    setIsLoading(true);
    setError(null);

    try {
      // Primary query: Fetch players through player_team_relationships
      const { data: playerRelationships, error: relationshipError } = await supabase
        .from('player_team_relationships')
        .select(`
          player:players!player_team_relationships_player_id_fkey (
            id,
            name,
            position,
            jersey_number,
            guardian_name,
            guardian_email,
            photo_url,
            graduation_year,
            recruit_profile,
            created_at,
            user_id,
            team_id
          )
        `)
        .eq('team_id', teamId)
        .eq('status', 'active');

      if (relationshipError) {
        console.error('useRosterPlayers: Relationship query failed:', relationshipError);
        throw relationshipError;
      }

      let fetchedPlayers: Player[] = [];

      if (playerRelationships && playerRelationships.length > 0) {
        fetchedPlayers = playerRelationships
          .map((rel) => rel.player)
          .filter((player) => player !== null) as Player[];
        
        console.log('useRosterPlayers: Found players via relationships:', fetchedPlayers.length);
      } else {
        // Fallback query: Direct query to players table
        console.log('useRosterPlayers: No relationships found, trying direct query');
        
        const { data: directPlayers, error: directError } = await supabase
          .from('players')
          .select('*')
          .eq('team_id', teamId);

        if (directError) {
          console.error('useRosterPlayers: Direct query failed:', directError);
          throw directError;
        }

        if (directPlayers) {
          fetchedPlayers = directPlayers as Player[];
          console.log('useRosterPlayers: Found players via direct query:', fetchedPlayers.length);
        }
      }

      setPlayers(fetchedPlayers);
      console.log('useRosterPlayers: Successfully loaded players:', fetchedPlayers.length);
      
    } catch (err: any) {
      console.error('useRosterPlayers: Error fetching players:', err);
      setError(err.message || 'Failed to load players');
      toast.error('Failed to load team roster');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch players when tab becomes active
  useEffect(() => {
    if (isActive && teamId) {
      fetchPlayers();
    }
  }, [isActive, teamId]);

  const refetch = () => {
    if (isActive && teamId) {
      fetchPlayers();
    }
  };

  return {
    players,
    isLoading,
    error,
    refetch
  };
};
