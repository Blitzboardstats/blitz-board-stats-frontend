import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GameSession, LiveStatAction, QuarterRoster } from '@/types/liveStatsTypes';
import { useAuth } from '@/contexts/AuthContextOptimized';

export const useGameSession = () => {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const createGameSession = async (sessionData: {
    event_id: string;
    team_id: string;
    team_side: 'home' | 'away';
    current_quarter: number;
  }) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          ...sessionData,
          created_by: user?.id!
        })
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion to ensure proper typing
      const typedData: GameSession = {
        ...data,
        team_side: data.team_side as 'home' | 'away',
        current_quarter: data.current_quarter as 1 | 2 | 3 | 4 | 5
      };
      
      setGameSession(typedData);
      return typedData;
    } catch (error) {
      console.error('Error creating game session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const endGameSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('game_sessions')
        .update({ 
          is_active: false, 
          end_time: new Date().toISOString() 
        })
        .eq('id', sessionId);

      if (error) throw error;
      
      setGameSession(null);
    } catch (error) {
      console.error('Error ending game session:', error);
      throw error;
    }
  };

  const recordAction = async (actionData: {
    game_session_id: string;
    player_id: string;
    quarter: number;
    side: 'offense' | 'defense';
    action_type: string;
    points: number;
  }) => {
    try {
      const { data, error } = await supabase
        .from('live_stat_actions')
        .insert(actionData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording action:', error);
      throw error;
    }
  };

  const getQuarterRoster = async (sessionId: string, quarter: number) => {
    try {
      const { data, error } = await supabase
        .from('quarter_rosters')
        .select('*')
        .eq('game_session_id', sessionId)
        .eq('quarter', quarter);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching quarter roster:', error);
      return [];
    }
  };

  const updateQuarterRoster = async (sessionId: string, quarter: number, playerIds: string[]) => {
    try {
      // First, remove existing roster for this quarter
      await supabase
        .from('quarter_rosters')
        .delete()
        .eq('game_session_id', sessionId)
        .eq('quarter', quarter);

      // Then, add new roster
      const rosterData = playerIds.map(playerId => ({
        game_session_id: sessionId,
        player_id: playerId,
        quarter,
        is_active: true
      }));

      const { error } = await supabase
        .from('quarter_rosters')
        .insert(rosterData);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating quarter roster:', error);
      throw error;
    }
  };

  const getGameStats = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('live_stat_actions')
        .select('*')
        .eq('game_session_id', sessionId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching game stats:', error);
      return [];
    }
  };

  return {
    gameSession,
    createGameSession,
    endGameSession,
    recordAction,
    getQuarterRoster,
    updateQuarterRoster,
    getGameStats,
    isLoading
  };
};
