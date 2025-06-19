import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProcessedPlayerStats } from "@/types/bulkStatsTypes";

interface PlayerSeasonStats {
  id?: string;
  player_id?: string;
  team_id?: string;
  season?: string;
  games_played?: number;
  qb_completions?: number;
  qb_touchdowns?: number;
  runs?: number;
  receptions?: number;
  player_td_points?: number;
  qb_td_points?: number;
  extra_point_1?: number;
  extra_point_2?: number;
  def_interceptions?: number;
  pick_6?: number;
  safeties?: number;
  flag_pulls?: number;
  total_points?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PlayerSeasonStatsWithDetails {
  id: string;
  player: {
    id: string;
    name: string;
    team_id: string;
    user_id: null;
    position: string;
    photo_url: null;
    created_at: string;
    guardian_name: string;
    jersey_number: string;
    guardian_email: string;
    graduation_year: null;
    recruit_profile: null;
  };
  season: string;
  games_played: number;
  qb_completions: number;
  qb_touchdowns: number;
  runs: number;
  receptions: number;
  player_td_points: number;
  qb_td_points: number;
  extra_point_1: number;
  extra_point_2: number;
  def_interceptions: number;
  pick_6: number;
  safeties: number;
  flag_pulls: number;
  total_points: number;
  created_at: Date;
}

export const usePlayerSeasonStats = ({
  playerId,
  teamId,
}: {
  playerId?: string;
  teamId?: string;
}) => {
  const [stats, setStats] = useState<PlayerSeasonStats | null>(null);
  const [playerSeasonStats, setPlayerSeasonStats] = useState<
    PlayerSeasonStatsWithDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (playerId) {
      // fetchPlayerStats();
    } else if (teamId) {
      fetchTeamPlayerStats();
    } else {
      setStats(null);
      setPlayerSeasonStats([]);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId, teamId]);

  const fetchPlayerStats = async () => {
    if (!playerId) return;

    console.log(
      "usePlayerSeasonStats: Fetching stats for player:",
      playerId,
      "team:",
      teamId
    );

    try {
      let query = supabase.from("player_season_stats").select(`
        *,
        player:players(*)
      `);

      if (teamId) {
        query = query.eq("team_id", teamId);
      }

      const { data: seasonStats, error } = await query;

      if (error) {
        console.error(
          "usePlayerSeasonStats: Error fetching season stats:",
          error
        );
        setStats(null);
      } else {
        console.log("usePlayerSeasonStats: Found season stats:", seasonStats);
        setPlayerSeasonStats(
          seasonStats as unknown as PlayerSeasonStatsWithDetails[]
        );
      }
    } catch (error) {
      console.error("usePlayerSeasonStats: Error in fetchStats:", error);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamPlayerStats = async () => {
    if (!teamId) return;

    console.log(
      "usePlayerSeasonStats: Fetching stats for player:",
      playerId,
      "team:",
      teamId
    );

    try {
      let query = supabase.from("player_season_stats").select(`
        *,
        player:players(*)
      `);

      if (teamId) {
        query = query.eq("team_id", teamId);
      }

      const { data: seasonStats, error } = await query;

      if (error) {
        console.error(
          "usePlayerSeasonStats: Error fetching season stats:",
          error
        );
        setStats(null);
      } else {
        console.log("usePlayerSeasonStats: Found season stats:", seasonStats);
        setPlayerSeasonStats(
          seasonStats as unknown as PlayerSeasonStatsWithDetails[]
        );
      }
    } catch (error) {
      console.error("usePlayerSeasonStats: Error in fetchStats:", error);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  const savePlayerSeasonStats = async (
    processedStats: ProcessedPlayerStats[],
    teamId: string
  ) => {
    console.log(
      "savePlayerSeasonStats: Starting save for team:",
      teamId,
      "stats:",
      processedStats
    );

    try {
      // Get team players to match against
      const { data: players, error: playersError } = await supabase
        .from("players")
        .select("id, name, jersey_number, guardian_email")
        .eq("team_id", teamId);

      if (playersError) {
        console.error("Error fetching players:", playersError);
        throw playersError;
      }

      console.log("Available players for matching:", players);

      const matchResults = [];
      const statsToInsert = [];

      for (const playerStats of processedStats) {
        console.log(
          `Processing season stats for jersey ${playerStats.jerseyNumber}`
        );

        const matchingPlayer = players?.find(
          (p) => p.jersey_number === playerStats.jerseyNumber
        );

        if (matchingPlayer) {
          // Check if season stats already exist
          const { data: existingStats, error: checkError } = await supabase
            .from("player_season_stats")
            .select("id")
            .eq("player_id", matchingPlayer.id)
            .eq("season", "2024")
            .maybeSingle();

          if (checkError) {
            console.error("Error checking existing stats:", checkError);
            continue;
          }

          const statData = {
            player_id: matchingPlayer.id,
            team_id: teamId,
            season: "2024",
            games_played: playerStats.gamesPlayed || 0,
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
          };

          if (existingStats) {
            // Update existing stats
            const { error: updateError } = await supabase
              .from("player_season_stats")
              .update(statData)
              .eq("id", existingStats.id);

            if (updateError) {
              console.error("Error updating season stats:", updateError);
            }
          } else {
            // Insert new stats
            statsToInsert.push(statData);
          }

          matchResults.push({
            jerseyNumber: playerStats.jerseyNumber,
            playerName: matchingPlayer.name,
            status: "matched",
          });
        } else {
          matchResults.push({
            jerseyNumber: playerStats.jerseyNumber,
            status: "no_match",
            reason: "No player with this jersey number",
          });
        }
      }

      // Insert new stats in batch
      if (statsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from("player_season_stats")
          .insert(statsToInsert);

        if (insertError) {
          console.error("Error inserting season stats:", insertError);
          throw insertError;
        }
      }

      console.log(`Successfully processed ${matchResults.length} players`);

      return {
        successCount: matchResults.filter((r) => r.status === "matched").length,
        totalCount: processedStats.length,
        matchResults,
      };
    } catch (error) {
      console.error("Error in savePlayerSeasonStats:", error);
      throw error;
    }
  };

  return {
    stats,
    playerSeasonStats,
    isLoading,
    savePlayerSeasonStats,
  };
};
