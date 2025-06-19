
import { useState, useEffect } from 'react';
import { SeasonLeaderboards } from '@/types/statsTypes';
import { usePlayerStats } from './usePlayerStats';

export const useLeaderboards = () => {
  const [leaderboards, setLeaderboards] = useState<SeasonLeaderboards | null>(null);
  const { playerStats, isLoading: statsLoading } = usePlayerStats();

  useEffect(() => {
    if (playerStats && playerStats.length > 0) {
      generateLeaderboards();
    }
  }, [playerStats]);

  const generateLeaderboards = () => {
    if (!playerStats) return;

    const createLeaderboard = (stat: keyof typeof playerStats[0], minValue = 0) => {
      return playerStats
        .filter(player => (player[stat] as number) > minValue)
        .sort((a, b) => (b[stat] as number) - (a[stat] as number))
        .slice(0, 10)
        .map((player, index) => ({
          playerId: player.playerId,
          playerName: player.playerName,
          playerNumber: player.playerNumber,
          teamName: player.teamName,
          value: player[stat] as number,
          rank: index + 1
        }));
    };

    setLeaderboards({
      touchdowns: createLeaderboard('touchdowns'),
      passingYards: createLeaderboard('passingYards'),
      rushingYards: createLeaderboard('rushingYards'),
      flagPulls: createLeaderboard('tackles'), // Map tackles to flagPulls for Flag Football
      interceptions: createLeaderboard('interceptions'),
      sacks: createLeaderboard('sacks')
    });
  };

  return { 
    leaderboards, 
    isLoading: statsLoading 
  };
};
