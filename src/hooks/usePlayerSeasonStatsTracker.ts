import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlayerSeasonStats {
  playerId: string;
  qbCompletions: number;
  qbTouchdowns: number;
  runs: number;
  receptions: number;
  playerTdPoints: number;
  qbTdPoints: number;
  extraPoint1: number;
  extraPoint2: number;
  defInterceptions: number;
  pick6: number;
  safeties: number;
  flagPulls: number;
  totalPoints: number;
}

export const usePlayerSeasonStatsTracker = () => {
  const [sessionStats, setSessionStats] = useState<Record<string, PlayerSeasonStats>>({});
  const [isSaving, setIsSaving] = useState(false);

  const initializePlayerStats = useCallback((playerId: string): PlayerSeasonStats => {
    return {
      playerId,
      qbCompletions: 0,
      qbTouchdowns: 0,
      runs: 0,
      receptions: 0,
      playerTdPoints: 0,
      qbTdPoints: 0,
      extraPoint1: 0,
      extraPoint2: 0,
      defInterceptions: 0,
      pick6: 0,
      safeties: 0,
      flagPulls: 0,
      totalPoints: 0,
    };
  }, []);

  const getPlayerStats = useCallback((playerId: string): PlayerSeasonStats => {
    if (!sessionStats[playerId]) {
      const newStats = initializePlayerStats(playerId);
      setSessionStats(prev => ({ ...prev, [playerId]: newStats }));
      return newStats;
    }
    return sessionStats[playerId];
  }, [sessionStats, initializePlayerStats]);

  const updatePlayerStat = useCallback((playerId: string, statType: string, points?: number) => {
    setSessionStats(prev => {
      const currentStats = prev[playerId] || initializePlayerStats(playerId);
      const updatedStats = { ...currentStats };

      // Map action types to stat updates
      switch (statType) {
        case 'completion':
          updatedStats.qbCompletions += 1;
          break;
        case 'td_pass':
          updatedStats.qbTouchdowns += 1;
          updatedStats.qbTdPoints += points || 6;
          updatedStats.totalPoints += points || 6;
          break;
        case 'td_run':
          updatedStats.qbTdPoints += points || 6;
          updatedStats.totalPoints += points || 6;
          break;
        case 'run':
          updatedStats.runs += 1;
          break;
        case 'reception':
          updatedStats.receptions += 1;
          break;
        case 'touchdown':
          updatedStats.playerTdPoints += points || 6;
          updatedStats.totalPoints += points || 6;
          break;
        case 'extra_point_1':
          updatedStats.extraPoint1 += 1;
          updatedStats.totalPoints += points || 1;
          break;
        case 'extra_point_2':
          updatedStats.extraPoint2 += 1;
          updatedStats.totalPoints += points || 2;
          break;
        case 'interception':
          updatedStats.defInterceptions += 1;
          if (points && points >= 6) {
            updatedStats.pick6 += 1;
            updatedStats.totalPoints += points;
          } else if (points) {
            updatedStats.totalPoints += points;
          }
          break;
        case 'flag_pull':
          updatedStats.flagPulls += 1;
          break;
        case 'safety':
          updatedStats.safeties += 1;
          updatedStats.totalPoints += points || 2;
          break;
        case 'sack':
          // Sacks don't typically add points but we track the action
          break;
        case 'fumble':
          // Fumbles don't add points but we track the action
          break;
        case 'interception_thrown':
          // QB interceptions thrown don't add points for the QB
          break;
        default:
          console.warn(`Unknown stat type: ${statType}`);
          break;
      }

      return { ...prev, [playerId]: updatedStats };
    });

    console.log(`Updated ${statType} for player ${playerId}${points ? ` (+${points} pts)` : ''}`);
  }, [initializePlayerStats]);

  const saveSessionStats = useCallback(async (teamId: string, season: string = '2025') => {
    if (!teamId || Object.keys(sessionStats).length === 0) {
      console.log('No stats to save or missing team ID');
      return { success: true, message: 'No stats to save' };
    }

    setIsSaving(true);
    
    try {
      console.log('Saving session stats for team:', teamId, 'Stats:', sessionStats);
      
      // Prepare upsert data for all players
      const upsertData = Object.values(sessionStats).map(stats => ({
        player_id: stats.playerId,
        team_id: teamId,
        season: season,
        qb_completions: stats.qbCompletions,
        qb_touchdowns: stats.qbTouchdowns,
        runs: stats.runs,
        receptions: stats.receptions,
        player_td_points: stats.playerTdPoints,
        qb_td_points: stats.qbTdPoints,
        extra_point_1: stats.extraPoint1,
        extra_point_2: stats.extraPoint2,
        def_interceptions: stats.defInterceptions,
        pick_6: stats.pick6,
        safeties: stats.safeties,
        flag_pulls: stats.flagPulls,
        total_points: stats.totalPoints,
        games_played: 1, // Increment games played
      }));

      console.log('Upsert data prepared:', upsertData);

       const { data, error } = await supabase
      .from('player_season_stats')
      .upsert(
        upsertData,
      )
      .select();
         
      if (error) {
        console.error('Error saving session stats:', error);
        throw error;
      }

      console.log('Session stats saved successfully:', data);
      
      // Clear session stats after successful save
      setSessionStats({});
      
      return { 
        success: true, 
        message: `Successfully saved stats for ${Object.keys(sessionStats).length} players`,
        data 
      };

    } catch (error) {
      console.error('Failed to save session stats:', error);
      return { 
        success: false, 
        message: `Failed to save stats: ${error.message}`,
        error 
      };
    } finally {
      setIsSaving(false);
    }
  }, [sessionStats]);

  const getAllSessionStats = useCallback(() => {
    return sessionStats;
  }, [sessionStats]);

  const resetSessionStats = useCallback(() => {
    setSessionStats({});
  }, []);

  return {
    getPlayerStats,
    updatePlayerStat,
    getAllSessionStats,
    resetSessionStats,
    saveSessionStats,
    isSaving,
    hasSessionStats: Object.keys(sessionStats).length > 0,
  };
};
