
import React from 'react';
import { GameSessionManager } from './GameSessionManager';

interface GameControlsSectionProps {
  selectedTeam: any;
  isGameActive: boolean;
  canManageGame: boolean;
  onStartGame: () => void;
  onPauseGame: () => void;
  onEndGame: () => void;
  onUndo: () => void;
  onFinalEndGame: () => void;
  isSaving: boolean;
}

export const GameControlsSection = ({
  selectedTeam,
  isGameActive,
  canManageGame,
  onStartGame,
  onPauseGame,
  onEndGame,
  onUndo,
  onFinalEndGame,
  isSaving
}: GameControlsSectionProps) => {
  return (
    <GameSessionManager
      selectedTeam={selectedTeam}
      isGameActive={isGameActive}
      canManageGame={canManageGame}
      onStartGame={onStartGame}
      onPauseGame={onPauseGame}
      onEndGame={onEndGame}
      onUndo={onUndo}
      onFinalEndGame={onFinalEndGame}
      isSaving={isSaving}
    />
  );
};
