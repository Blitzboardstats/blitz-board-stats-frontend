
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';
import { GameControlButtons } from './GameControlButtons';

interface GameSessionManagerProps {
  selectedTeam: any;
  isGameActive: boolean;
  canManageGame: boolean;
  onStartGame: () => void;
  onPauseGame: () => void;
  onEndGame: () => void;
  onUndo: () => void;
  onFinalEndGame?: () => void;
  isSaving?: boolean;
}

export const GameSessionManager = ({
  selectedTeam,
  isGameActive,
  canManageGame,
  onStartGame,
  onPauseGame,
  onEndGame,
  onUndo,
  onFinalEndGame,
  isSaving = false
}: GameSessionManagerProps) => {
  if (!selectedTeam) {
    return (
      <Card className='bg-blitz-darkgray border-gray-700'>
        <CardContent className='p-3'>
          <div className='text-center text-gray-400'>
            No team selected
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='bg-blitz-darkgray border-gray-700'>
      <CardContent className='p-3'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='font-semibold text-black flex items-center space-x-2'>
            <Play size={16} className='text-blitz-purple' />
            <span>Game Controls - {selectedTeam?.name}</span>
          </h3>
          {isGameActive && (
            <Badge
              variant='outline'
              className='bg-green-500/20 text-green-400 border-green-500 text-xs'
            >
              LIVE
            </Badge>
          )}
        </div>
        
        {/* Always show the GameControlButtons if user can manage the game */}
        <GameControlButtons
          canEdit={canManageGame}
          isRunning={isGameActive}
          onStart={onStartGame}
          onPause={onPauseGame}
          onEndGame={onEndGame}
          onUndo={onUndo}
          onFinalEndGame={onFinalEndGame}
          isSaving={isSaving}
        />
        
        {!canManageGame && (
          <div className='text-center text-gray-400 text-sm mt-2'>
            You don't have permission to control this game
          </div>
        )}
      </CardContent>
    </Card>
  );
};
