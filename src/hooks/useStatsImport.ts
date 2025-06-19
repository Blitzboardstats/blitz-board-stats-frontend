
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';

export const useStatsImport = (primaryTeam: any) => {
  const { user } = useAuth();

  const handleImportGameStats = async (stats: any[], gameInfo: any) => {
    if (!primaryTeam) {
      toast.error('No team selected');
      return false;
    }

    try {
      console.log('LiveGameLayout: Importing game stats:', stats, gameInfo);
      
      // First, create an individual game record
      const { data: gameRecord, error: gameError } = await supabase
        .from('individual_games')
        .insert({
          team_id: primaryTeam.id,
          opponent: gameInfo.opponent,
          game_date: gameInfo.gameDate,
          game_type: gameInfo.gameType,
          is_home_game: gameInfo.isHomeGame,
          created_by: user?.id
        })
        .select()
        .single();

      if (gameError) {
        console.error('Error creating game record:', gameError);
        throw gameError;
      }

      // Get team players to match against
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('id, name, jersey_number, guardian_email')
        .eq('team_id', primaryTeam.id);

      if (playersError) {
        console.error('Error fetching players:', playersError);
        throw playersError;
      }

      const gameStatsToInsert = [];
      const matchResults = [];

      for (const playerStats of stats) {
        const matchingPlayer = players?.find(p => 
          p.jersey_number === playerStats.jerseyNumber
        );

        if (matchingPlayer) {
          gameStatsToInsert.push({
            player_id: matchingPlayer.id,
            team_id: primaryTeam.id,
            game_date: gameInfo.gameDate,
            quarter: gameInfo.quarter || 1,
            opponent: gameInfo.opponent,
            qb_completions: playerStats.totalQbCompletions || 0,
            qb_touchdowns: playerStats.totalQbTouchdowns || 0,
            runs: playerStats.totalRuns || 0,
            receptions: playerStats.totalReceptions || 0,
            player_td_points: playerStats.totalPlayerTdPoints || 0,
            qb_td_points: playerStats.totalQbTdPoints || 0,
            extra_point_1: playerStats.totalExtraPoint1 || 0,
            extra_point_2: playerStats.totalExtraPoint2 || 0,
            def_interceptions: playerStats.totalDefInterceptions || 0,
            pick_6: playerStats.totalPick6 || 0,
            safeties: playerStats.totalSafeties || 0,
            flag_pulls: playerStats.totalFlagPulls || 0,
          });

          matchResults.push({
            jerseyNumber: playerStats.jerseyNumber,
            playerName: matchingPlayer.name,
            status: 'matched'
          });
        } else {
          matchResults.push({
            jerseyNumber: playerStats.jerseyNumber,
            status: 'no_match'
          });
        }
      }

      if (gameStatsToInsert.length > 0) {
        // Insert game stats
        const { error: statsError } = await supabase
          .from('game_stats')
          .insert(gameStatsToInsert);

        if (statsError) {
          console.error('Error inserting game stats:', statsError);
          throw statsError;
        }

        // Update season stats for each player
        for (const gameStat of gameStatsToInsert) {
          const { data: existingSeasonStats, error: fetchError } = await supabase
            .from('player_season_stats')
            .select('*')
            .eq('player_id', gameStat.player_id)
            .eq('season', '2024')
            .maybeSingle();

          if (fetchError) {
            console.error('Error fetching existing season stats:', fetchError);
            continue;
          }

          if (existingSeasonStats) {
            // Update existing season stats
            await supabase
              .from('player_season_stats')
              .update({
                qb_completions: existingSeasonStats.qb_completions + gameStat.qb_completions,
                qb_touchdowns: existingSeasonStats.qb_touchdowns + gameStat.qb_touchdowns,
                runs: existingSeasonStats.runs + gameStat.runs,
                receptions: existingSeasonStats.receptions + gameStat.receptions,
                player_td_points: existingSeasonStats.player_td_points + gameStat.player_td_points,
                qb_td_points: existingSeasonStats.qb_td_points + gameStat.qb_td_points,
                extra_point_1: existingSeasonStats.extra_point_1 + gameStat.extra_point_1,
                extra_point_2: existingSeasonStats.extra_point_2 + gameStat.extra_point_2,
                def_interceptions: existingSeasonStats.def_interceptions + gameStat.def_interceptions,
                pick_6: existingSeasonStats.pick_6 + gameStat.pick_6,
                safeties: existingSeasonStats.safeties + gameStat.safeties,
                flag_pulls: existingSeasonStats.flag_pulls + gameStat.flag_pulls,
                games_played: existingSeasonStats.games_played + 1,
              })
              .eq('id', existingSeasonStats.id);
          } else {
            // Create new season stats record
            await supabase
              .from('player_season_stats')
              .insert({
                player_id: gameStat.player_id,
                team_id: gameStat.team_id,
                season: '2024',
                qb_completions: gameStat.qb_completions,
                qb_touchdowns: gameStat.qb_touchdowns,
                runs: gameStat.runs,
                receptions: gameStat.receptions,
                player_td_points: gameStat.player_td_points,
                qb_td_points: gameStat.qb_td_points,
                extra_point_1: gameStat.extra_point_1,
                extra_point_2: gameStat.extra_point_2,
                def_interceptions: gameStat.def_interceptions,
                pick_6: gameStat.pick_6,
                safeties: gameStat.safeties,
                flag_pulls: gameStat.flag_pulls,
                games_played: 1,
              });
          }
        }

        toast.success(`Game stats imported successfully for ${gameStatsToInsert.length} players`);
        return true;
      } else {
        toast.error('No players could be matched for import');
        return false;
      }
    } catch (error) {
      console.error('Error importing game stats:', error);
      toast.error('Failed to import game stats');
      return false;
    }
  };

  return { handleImportGameStats };
};
