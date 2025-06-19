
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';

interface GuardianInfo {
  email: string;
  name?: string;
  user_id?: string;
  relationship_exists: boolean;
  id?: string;
}

export const usePlayerGuardianData = () => {
  const { user } = useAuth();
  const [playerData, setPlayerData] = useState<any>(null);
  const [existingGuardians, setExistingGuardians] = useState<GuardianInfo[]>([]);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(true);

  const fetchPlayerData = async () => {
    console.log('Fetching player data for user:', user?.id);
    setIsLoadingPlayer(true);
    
    try {
      const { data: players, error } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', user?.id);

      console.log('Player query result:', { players, error });

      if (error) {
        console.error('Error fetching player data:', error);
        setIsLoadingPlayer(false);
        return;
      }

      const playerRecord = players && players.length > 0 ? players[0] : null;
      console.log('Selected player record:', playerRecord);
      
      setPlayerData(playerRecord);
    } catch (error) {
      console.error('Error fetching player data:', error);
    } finally {
      setIsLoadingPlayer(false);
    }
  };

  const fetchExistingGuardians = async () => {
    if (!playerData?.id) return;

    try {
      console.log('Fetching guardians for player:', playerData?.id);
      
      const { data: guardianRelationships, error } = await supabase
        .from('player_guardians')
        .select('id, guardian_user_id, relationship_type, can_edit, can_view_stats')
        .eq('player_id', playerData?.id);

      console.log('Guardian relationships query result:', { guardianRelationships, error });

      if (error) {
        console.error('Error fetching guardian relationships:', error);
        return;
      }

      if (!guardianRelationships || guardianRelationships.length === 0) {
        console.log('No guardian relationships found');
        setExistingGuardians([]);
        return;
      }

      const guardianUserIds = guardianRelationships.map(rel => rel.guardian_user_id);
      
      const { data: userProfiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, display_name, email')
        .in('id', guardianUserIds);

      console.log('User profiles query result:', { userProfiles, profileError });

      if (profileError) {
        console.error('Error fetching user profiles:', profileError);
        setExistingGuardians([]);
        return;
      }

      const guardianInfos: GuardianInfo[] = guardianRelationships.map(rel => {
        const profile = userProfiles?.find(p => p.id === rel.guardian_user_id);
        return {
          email: profile?.email || '',
          name: profile?.display_name || '',
          user_id: rel.guardian_user_id,
          relationship_exists: true,
          id: rel.id
        };
      });

      console.log('Transformed guardian infos:', guardianInfos);
      setExistingGuardians(guardianInfos);
    } catch (error) {
      console.error('Error fetching existing guardians:', error);
      setExistingGuardians([]);
    }
  };

  useEffect(() => {
    if (user?.id && user?.role === 'player') {
      fetchPlayerData();
    }
  }, [user?.id, user?.role]);

  useEffect(() => {
    if (playerData?.id) {
      fetchExistingGuardians();
    }
  }, [playerData?.id]);

  return {
    playerData,
    existingGuardians,
    isLoadingPlayer,
    fetchPlayerData,
    fetchExistingGuardians
  };
};
