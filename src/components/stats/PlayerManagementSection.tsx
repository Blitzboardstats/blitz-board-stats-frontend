
import React from 'react';
import { GameStatusIndicator } from './GameStatusIndicator';
import { ActivePlayersDisplay } from './ActivePlayersDisplay';
import { PlayerSelectionHints } from './PlayerSelectionHints';
import { SideToggle } from './SideToggle';
import { OffensiveActions } from './OffensiveActions';
import { DefensiveActions } from './DefensiveActions';

interface PlayerManagementSectionProps {
  isGameActive: boolean;
  selectedPlayer: string | null;
  activePlayers: any[];
  canEdit: boolean;
  onManageRoster: () => void;
  onPlayerSelect: (playerId: string) => void;
  selectedSide: 'offense' | 'defense';
  setSelectedSide: (side: 'offense' | 'defense') => void;
  updatePlayerStat: (playerId: string, statType: string, value: number) => void;
}

export const PlayerManagementSection = ({
  isGameActive,
  selectedPlayer,
  activePlayers,
  canEdit,
  onManageRoster,
  onPlayerSelect,
  selectedSide,
  setSelectedSide,
  updatePlayerStat
}: PlayerManagementSectionProps) => {
  return (
    <>
      {/* Game Status Indicator */}
      <GameStatusIndicator
        isGameActive={isGameActive}
        selectedPlayer={selectedPlayer || ""}
        activePlayers={activePlayers}
      />

      {/* Active Players - Top Priority */}
      <div className={`transition-opacity ${!isGameActive ? "opacity-50" : ""}`}>
        <ActivePlayersDisplay
          activePlayers={activePlayers}
          canEdit={canEdit}
          isGameActive={isGameActive}
          onManageRoster={onManageRoster}
          selectedPlayer={selectedPlayer}
          onPlayerSelect={onPlayerSelect}
        />
      </div>

      {/* Player Selection Hints */}
      <PlayerSelectionHints
        isGameActive={isGameActive}
        selectedPlayer={selectedPlayer || ""}
        activePlayers={activePlayers}
      />

      {/* Offense/Defense Toggle - Compact with disabled state */}
      <div className={`transition-opacity ${!isGameActive ? "opacity-50" : ""}`}>
        <SideToggle
          selectedSide={selectedSide}
          setSelectedSide={setSelectedSide}
          canEdit={canEdit && isGameActive}
        />
      </div>

      {/* Action Buttons - Mobile Optimized with disabled state */}
      <div className={`transition-opacity ${!isGameActive ? "opacity-50" : ""}`}>
        {selectedSide === "offense" ? (
          <OffensiveActions
            canEdit={canEdit}
            isGameActive={isGameActive}
            selectedPlayer={selectedPlayer}
            onStatUpdate={updatePlayerStat}
          />
        ) : (
          <DefensiveActions
            canEdit={canEdit}
            isGameActive={isGameActive}
            selectedPlayer={selectedPlayer}
            onStatUpdate={updatePlayerStat}
          />
        )}
      </div>
    </>
  );
};
