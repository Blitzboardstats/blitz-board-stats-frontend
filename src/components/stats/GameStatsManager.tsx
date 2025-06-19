
import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContextOptimized";
import { useToast } from "@/hooks/use-toast";

interface GameStatsManagerProps {
  selectedTeam: any;
  homeTeam: any;
  hasSessionStats: boolean;
  saveSessionStats: (teamId: string, season: string) => Promise<any>;
  onEndGame: () => void;
}

export const useGameStatsManager = ({
  selectedTeam,
  homeTeam,
  hasSessionStats,
  saveSessionStats,
  onEndGame
}: GameStatsManagerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleEndGame = async () => {
    // Save session stats first
    if (hasSessionStats && selectedTeam?.id) {
      const statsResult = await saveSessionStats(selectedTeam.id, "2025");

      if (statsResult.success) {
        toast({
          title: "Game Ended",
          description: "Game data and player stats saved successfully",
        });
      } else {
        toast({
          title: "Warning",
          description: "Game saved but there was an issue saving player stats",
          variant: "destructive",
        });
      }
    }

    // Save game record
    const { error } = await supabase.from("individual_games").insert([
      {
        team_id: selectedTeam.id,
        game_date: new Date().toISOString(),
        opponent: "Eagle",
        game_type: "regular",
        final_score_home: homeTeam.score,
        final_score_away: 0,
        is_home_game: true,
        notes: "good game",
        created_by: user.id,
      },
    ]);

    if (error) {
      console.error("Error saving game:", error);
      toast({
        title: "Error",
        description: "Failed to save game record",
        variant: "destructive",
      });
    }

    // Call the parent's onEndGame
    onEndGame();
  };

  const handleSaveStats = async (primaryTeam: any) => {
    if (!primaryTeam?.id) {
      toast({
        title: "Error",
        description: "No team selected to save stats for",
        variant: "destructive",
      });
      return;
    }

    const result = await saveSessionStats(primaryTeam.id, "2025");

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return { handleEndGame, handleSaveStats };
};
