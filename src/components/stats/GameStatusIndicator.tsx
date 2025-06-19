
import React from 'react';

interface GameStatusIndicatorProps {
  isGameActive: boolean;
  selectedPlayer: string;
  activePlayers: Array<{ id: string; number: string; }>;
}

export const GameStatusIndicator = ({ 
  isGameActive, 
  selectedPlayer, 
  activePlayers 
}: GameStatusIndicatorProps) => {
  if (!isGameActive) {
    return (
      <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-3 text-center">
        <div className="text-yellow-400 text-sm font-medium">
          ⚠️ Game Not Started - Start the game to enable player actions
        </div>
      </div>
    );
  }

  return null;
};
