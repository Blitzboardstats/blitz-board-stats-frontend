
import React, { useState } from "react";
import { usePlayerSeasonStats } from "@/hooks/usePlayerSeasonStats";
import { useAuth } from "@/contexts/AuthContextOptimized";
import { usePermissions } from "@/hooks/usePermissions";
import { PlayerSeasonStatsTable } from "./PlayerSeasonStatsTable";
import { PlayerSeasonStatsHeader } from "./PlayerSeasonStatsHeader";
import { PlayerSeasonStatsCardView } from "./PlayerSeasonStatsCardView";
import { PlayerSeasonStatsLoadingState } from "./PlayerSeasonStatsLoadingState";
import { PlayerSeasonStatsEmptyState } from "./PlayerSeasonStatsEmptyState";

interface PlayerSeasonStatsViewProps {
  teamId: string;
}

export const PlayerSeasonStatsView = ({
  teamId,
}: PlayerSeasonStatsViewProps) => {
  const { user, isAdmin } = useAuth();
  const { permissions } = usePermissions(teamId);
  const { playerSeasonStats, isLoading } = usePlayerSeasonStats({ teamId });
  const [viewMode, setViewMode] = useState<"grid" | "cards">("grid");

  if (isLoading) {
    return <PlayerSeasonStatsLoadingState />;
  }

  // Filter stats based on permissions
  const visibleStats = playerSeasonStats.filter((player) => {
    const canView = true;
    return canView;
  });

  if (visibleStats.length === 0) {
    return (
      <PlayerSeasonStatsEmptyState
        isAdmin={isAdmin}
        canViewAllPlayerStats={permissions.canViewAllPlayerStats}
        userEmail={user?.email}
      />
    );
  }

  return (
    <div className='space-y-6'>
      <PlayerSeasonStatsHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === "grid" ? (
        <PlayerSeasonStatsTable
          playerStats={visibleStats}
          isAdmin={isAdmin || permissions.canViewAllPlayerStats}
          userEmail={user?.email}
        />
      ) : (
        <PlayerSeasonStatsCardView
          visibleStats={visibleStats}
          isAdmin={isAdmin}
          canViewAllPlayerStats={permissions.canViewAllPlayerStats}
          userEmail={user?.email}
        />
      )}
    </div>
  );
};
