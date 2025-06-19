import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TeamStats } from '@/types/statsTypes';
import { useAuth } from '@/contexts/AuthContextOptimized';

export const useTeamStats = () => {
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTeamStats();
    }
  }, [user]);

  const fetchTeamStats = async () => {
    try {
      setIsLoading(true);

      // Get user's teams
      const { data: userTeams, error: teamsError } = await supabase
        .from('team_members')
        .select(`
          team_id,
          teams (
            id,
            name,
            wins,
            losses,
            draws
          )
        `)
        .eq('user_id', user?.id);

      if (teamsError) throw teamsError;

      if (!userTeams || userTeams.length === 0) {
        setTeamStats([]);
        return;
      }

      const stats: TeamStats[] = [];

      for (const userTeam of userTeams) {
        const team = userTeam.teams;
        if (!team) continue;

        // Calculate points from live stat actions
        const { data: actions, error: actionsError } = await supabase
          .from('live_stat_actions')
          .select(`
            points,
            game_sessions!inner(team_id)
          `)
          .eq('game_sessions.team_id', team.id);

        if (actionsError) {
          console.error('Error fetching actions:', actionsError);
          continue;
        }

        const totalPointsScored = actions?.reduce((sum, action) => sum + (action.points || 0), 0) || 0;

        // For now, we'll calculate basic stats
        const gamesPlayed = (team.wins || 0) + (team.losses || 0) + (team.draws || 0);
        const winPercentage = gamesPlayed > 0 ? ((team.wins || 0) / gamesPlayed) * 100 : 0;

        stats.push({
          teamId: team.id,
          teamName: team.name,
          gamesPlayed,
          wins: team.wins || 0,
          losses: team.losses || 0,
          draws: team.draws || 0,
          pointsScored: totalPointsScored,
          pointsAllowed: 0, // TODO: Calculate opponent points
          winPercentage,
          averagePointsScored: gamesPlayed > 0 ? totalPointsScored / gamesPlayed : 0,
          averagePointsAllowed: 0, // TODO: Calculate
          season: '2024' // TODO: Make dynamic
        });
      }

      setTeamStats(stats);
    } catch (error) {
      console.error('Error fetching team stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { teamStats, isLoading, refetch: fetchTeamStats };
};
