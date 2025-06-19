
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { Player } from '@/types/playerTypes';

export const useGuardianPlayers = (teamId?: string) => {
  const { user } = useAuth();
  const [guardianPlayers, setGuardianPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setGuardianPlayers([]);
      setIsLoading(false);
      return;
    }

    const fetchGuardianPlayers = async () => {
      console.log('useGuardianPlayers: Fetching players for guardian:', user.email, 'teamId:', teamId);
      
      try {
        let query = supabase
          .from('players')
          .select('*')
          .eq('guardian_email', user.email);

        if (teamId) {
          query = query.eq('team_id', teamId);
        }

        const { data: players, error } = await query;

        if (error) {
          console.error('useGuardianPlayers: Error fetching guardian players:', error);
          setGuardianPlayers([]);
        } else {
          console.log('useGuardianPlayers: Found guardian players:', players);
          setGuardianPlayers(players || []);
        }
      } catch (error) {
        console.error('useGuardianPlayers: Error in fetchGuardianPlayers:', error);
        setGuardianPlayers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuardianPlayers();
  }, [user, teamId]);

  return { guardianPlayers, isLoading };
};
