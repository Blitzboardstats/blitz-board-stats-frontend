
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Undo, Play, Square, Power } from 'lucide-react';

interface GameControlButtonsProps {
  canEdit: boolean;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onEndGame: () => void;
  onUndo: () => void;
  onFinalEndGame?: () => void;
  isSaving?: boolean;
}

export const GameControlButtons = ({
  canEdit,
  isRunning,
  onStart,
  onPause,
  onEndGame,
  onUndo,
  onFinalEndGame,
  isSaving = false
}: GameControlButtonsProps) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-2">
      <div className="overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          <Button
            onClick={onStart}
            disabled={!canEdit || isRunning}
            variant="default"
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0 disabled:opacity-50"
          >
            <Play size={14} className="mr-1" />
            <span className="text-xs">Start</span>
          </Button>
          
          <Button
            onClick={onPause}
            disabled={!canEdit || !isRunning}
            variant="default"
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700 text-white flex-shrink-0 disabled:opacity-50"
          >
            <Pause size={14} className="mr-1" />
            <span className="text-xs">Pause</span>
          </Button>
          
          <Button
            onClick={onUndo}
            disabled={!canEdit}
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0 disabled:opacity-50"
          >
            <Undo size={14} className="mr-1" />
            <span className="text-xs">Undo</span>
          </Button>
          
          <Button
            onClick={onEndGame}
            disabled={!canEdit}
            variant="destructive"
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0 disabled:opacity-50"
          >
            <Square size={14} className="mr-1" />
            <span className="text-xs">Stop</span>
          </Button>

          {onFinalEndGame && (
            <Button
              onClick={onFinalEndGame}
              disabled={!canEdit || isSaving}
              variant="destructive"
              size="sm"
              className="bg-red-800 hover:bg-red-900 text-white flex-shrink-0 disabled:opacity-50"
            >
              <Power size={14} className="mr-1" />
              <span className="text-xs">{isSaving ? "Ending..." : "End Game"}</span>
            </Button>
          )}
        </div>
      </div>
      
      {!canEdit && (
        <div className='text-center text-gray-400 text-xs mt-2'>
          Game controls are view-only
        </div>
      )}
    </div>
  );
};
