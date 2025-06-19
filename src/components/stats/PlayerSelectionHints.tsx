
import React from 'react';

interface PlayerSelectionHintsProps {
  isGameActive: boolean;
  selectedPlayer: string;
  activePlayers: Array<{ id: string; number: string; }>;
}

export const PlayerSelectionHints = ({ 
  isGameActive, 
  selectedPlayer, 
  activePlayers 
}: PlayerSelectionHintsProps) => {
  if (!isGameActive) return null;

  if (!selectedPlayer) {
    return (
      <div className="bg-blue-900/50 border border-blue-600 rounded-lg p-2 text-center">
        <div className="text-blue-400 text-xs">
          💡 Select a player above to record actions
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-lg p-2 text-center">
      <div className="text-gray-400 text-xs">
        💡 Click player #{activePlayers.find(p => p.id === selectedPlayer)?.number} again to deselect
      </div>
    </div>
  );
};
