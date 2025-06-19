
import React from 'react';
import { GameImportSection } from './GameImportSection';
import { LiveSeasonStatsDisplay } from './LiveSeasonStatsDisplay';
import { StatsSaveSection } from './StatsSaveSection';

interface StatsManagementSectionProps {
  canEdit: boolean;
  isGameActive: boolean;
  primaryTeam: any;
  showGameImport: boolean;
  onShowGameImport: (show: boolean) => void;
  onImportGameStats: (stats: any[], gameInfo: any) => Promise<boolean>;
  selectedPlayer: string | null;
  currentPlayerStats: any;
  activePlayers: any[];
  hasSessionStats: boolean;
  isSaving: boolean;
  onSaveStats: () => Promise<void>;
}

export const StatsManagementSection = ({
  canEdit,
  isGameActive,
  primaryTeam,
  showGameImport,
  onShowGameImport,
  onImportGameStats,
  selectedPlayer,
  currentPlayerStats,
  activePlayers,
  hasSessionStats,
  isSaving,
  onSaveStats
}: StatsManagementSectionProps) => {
  return (
    <>
      {/* Import Game Stats Section - Only show for coaches when game is not active */}
      <div className='bg-gray-800 border border-gray-700 rounded-lg p-2'>
        <GameImportSection
          canEdit={canEdit}
          isGameActive={isGameActive}
          primaryTeam={primaryTeam}
          showGameImport={showGameImport}
          onShowGameImport={onShowGameImport}
          onImportGameStats={onImportGameStats}
        />
      </div>

      {/* Live Season Stats Display */}
      <div className={`transition-opacity ${!isGameActive ? "opacity-50" : ""}`}>
        <LiveSeasonStatsDisplay
          selectedPlayer={selectedPlayer}
          playerStats={currentPlayerStats}
          activePlayers={activePlayers}
          isGameActive={isGameActive}
        />
      </div>

      {/* Stats Save Section */}
      <StatsSaveSection
        hasSessionStats={hasSessionStats}
        canEdit={canEdit}
        isSaving={isSaving}
        onSaveStats={onSaveStats}
      />
    </>
  );
};
