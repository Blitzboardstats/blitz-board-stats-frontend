
import React from "react";
import { PlayerSeasonStatsCard } from "./PlayerSeasonStatsCard";
import { PlayerSeasonStatsWithDetails } from "@/hooks/usePlayerSeasonStats";

interface PlayerSeasonStatsCardViewProps {
  visibleStats: PlayerSeasonStatsWithDetails[];
  isAdmin: boolean;
  canViewAllPlayerStats: boolean;
  userEmail?: string;
}

export const PlayerSeasonStatsCardView = ({
  visibleStats,
  isAdmin,
  canViewAllPlayerStats,
  userEmail,
}: PlayerSeasonStatsCardViewProps) => {
  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h2 className='text-xl font-bold text-black mb-2'>
          {isAdmin || canViewAllPlayerStats
            ? "Team Season Statistics"
            : "My Player's Season Statistics"}
        </h2>
        <p className='text-black text-sm'>
          Season statistics from uploaded game data
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {visibleStats.map((player) => (
          <PlayerSeasonStatsCard
            key={player.id}
            player={player}
            userEmail={userEmail}
          />
        ))}
      </div>
    </div>
  );
};
