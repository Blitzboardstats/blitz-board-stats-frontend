
import React from 'react';
import { PlayerRosterManager } from './PlayerRosterManager';

interface LiveGameRosterManagerProps {
  primaryTeam: any;
  canEdit: boolean;
  onActivePlayersChange: (players: any[]) => void;
  onBackToGame: () => void;
}

export const LiveGameRosterManager = ({
  primaryTeam,
  canEdit,
  onActivePlayersChange,
  onBackToGame
}: LiveGameRosterManagerProps) => {
  return (
    <div className="space-y-4 bg-black text-white min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Manage Active Players
          {primaryTeam && <span className="text-blitz-purple ml-2">- {primaryTeam.name}</span>}
        </h2>
        <button 
          onClick={onBackToGame}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Back to Game
        </button>
      </div>
      <PlayerRosterManager 
        canEdit={canEdit} 
        onActivePlayersChange={onActivePlayersChange}
      />
    </div>
  );
};
