import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PlayerSeasonStats } from '@/types/statsTypes';
import { useAuth } from '@/contexts/AuthContextOptimized';

export const usePlayerStats = () => {
  const [playerStats, setPlayerStats] = useState<PlayerSeasonStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPlayerStats();
    }
  }, [user]);

  const fetchPlayerStats = async () => {
    try {
      setIsLoading(true);

      // Get user's teams
      const { data: userTeams, error: teamsError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user?.id);

      if (teamsError) throw teamsError;

      if (!userTeams || userTeams.length === 0) {
        setPlayerStats([]);
        return;
      }

      const teamIds = userTeams.map(t => t.team_id);

      // Get players from user's teams with guardian information
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select(`
          id,
          name,
          jersey_number,
          position,
          team_id,
          guardian_email,
          guardian_name,
          teams (name)
        `)
        .in('team_id', teamIds);

      if (playersError) throw playersError;

      if (!players) {
        setPlayerStats([]);
        return;
      }

      const stats: PlayerSeasonStats[] = [];

      for (const player of players) {
        // Get player's live stat actions
        const { data: actions, error: actionsError } = await supabase
          .from('live_stat_actions')
          .select('*')
          .eq('player_id', player.id);

        if (actionsError) {
          console.error('Error fetching player actions:', actionsError);
          continue;
        }

        // Calculate Flag Football specific stats from actions
        const touchdowns = actions?.filter(a => 
          a.action_type.includes('touchdown') || a.action_type.includes('td')
        ).length || 0;

        const rushingActions = actions?.filter(a => a.action_type === 'run') || [];
        const passingActions = actions?.filter(a => a.action_type === 'completion') || [];
        const receptions = actions?.filter(a => a.action_type === 'reception').length || 0;
        const flagPulls = actions?.filter(a => a.action_type === 'flag_pull').length || 0; // Flag Football specific
        const sacks = actions?.filter(a => a.action_type === 'sack').length || 0;
        const interceptions = actions?.filter(a => a.action_type === 'interception').length || 0;
        const fumbles = actions?.filter(a => a.action_type === 'fumble').length || 0;
        const interceptionsThrown = actions?.filter(a => a.action_type === 'interception_thrown').length || 0;

        const totalPoints = actions?.reduce((sum, action) => sum + (action.points || 0), 0) || 0;

        const gamesSessions = await supabase
          .from('game_sessions')
          .select('id')
          .eq('team_id', player.team_id);

        const gamesPlayed = gamesSessions.data?.length || 0;

        const completions = passingActions.length;
        const passingAttempts = completions; // Simplified
        const completionPercentage = passingAttempts > 0 ? (completions / passingAttempts) * 100 : 0;

        stats.push({
          playerId: player.id,
          playerName: player.name,
          playerNumber: player.jersey_number || '00',
          position: player.position || 'Unknown',
          teamId: player.team_id,
          teamName: player.teams?.name || 'Unknown Team',
          guardianEmail: player.guardian_email, // Include guardian info for permission checks
          guardianName: player.guardian_name,
          gamesPlayed,
          touchdowns,
          rushingYards: rushingActions.length * 5, // Simplified calculation
          passingYards: passingActions.length * 8, // Simplified calculation
          receptions,
          completions,
          passingAttempts,
          completionPercentage,
          interceptionsThrown,
          fumbles,
          tackles: flagPulls, // Flag Football: Flag pulls instead of tackles
          sacks,
          interceptions,
          fumbleRecoveries: 0, // TODO: Add this action type
          passBreakups: 0, // TODO: Add this action type
          safeties: actions?.filter(a => a.action_type === 'safety').length || 0,
          extraPoints: actions?.filter(a => a.action_type.includes('extra_point')).length || 0,
          totalPoints,
          season: '2024'
        });
      }

      setPlayerStats(stats);
    } catch (error) {
      console.error('Error fetching player stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { playerStats, isLoading, refetch: fetchPlayerStats };
};
