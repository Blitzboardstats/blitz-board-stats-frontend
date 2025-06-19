
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DroppableActionButton } from './DroppableActionButton';

interface OffensiveActionsProps {
  canEdit: boolean;
  isGameActive: boolean;
  selectedPlayer?: string;
  onStatUpdate?: (playerId: string, statType: string, points?: number) => void;
}

export const OffensiveActions = ({ 
  canEdit, 
  isGameActive, 
  selectedPlayer,
  onStatUpdate
}: OffensiveActionsProps) => {
  const handleAction = (actionType: string, points?: number, playerId?: string) => {
    const targetPlayer = playerId || selectedPlayer;
    if (!targetPlayer) {
      alert('Please select a player first');
      return;
    }
    
    // Update stats if callback provided
    if (onStatUpdate) {
      onStatUpdate(targetPlayer, actionType, points);
    }
    
    console.log(`${actionType} recorded for player ${targetPlayer}${points ? ` with ${points} points` : ''}`);
    // TODO: Record the action in game session
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-3">
        {/* QB Actions */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-blue-400 mb-2">QB Actions</h3>
          <div className="overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              <DroppableActionButton 
                label="PASS" 
                color="bg-green-600 hover:bg-green-700"
                onClick={(playerId) => handleAction('completion', undefined, playerId)}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
              <DroppableActionButton 
                label="TD PASS" 
                color="bg-yellow-600 hover:bg-yellow-700" 
                points={6}
                width="w-20"
                onClick={(playerId) => handleAction('td_pass', 6, playerId)}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
              <DroppableActionButton 
                label="INT" 
                color="bg-red-600 hover:bg-red-700"
                onClick={(playerId) => handleAction('interception_thrown', undefined, playerId)}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
              <DroppableActionButton 
                label="TD RUN" 
                color="bg-orange-600 hover:bg-orange-700" 
                points={6}
                width="w-20"
                onClick={(playerId) => handleAction('td_run', 6, playerId)}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
            </div>
          </div>
        </div>

        {/* Player Actions */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-green-400 mb-2">Player Actions</h3>
          <div className="overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              <DroppableActionButton 
                label="RUN" 
                color="bg-blue-600 hover:bg-blue-700"
                onClick={(playerId) => handleAction('run', undefined, playerId)}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
              <DroppableActionButton 
                label="CATCH" 
                color="bg-teal-600 hover:bg-teal-700"
                onClick={(playerId) => handleAction('reception', undefined, playerId)}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
              <DroppableActionButton 
                label="TD" 
                color="bg-orange-600 hover:bg-orange-700" 
                points={6}
                onClick={(playerId) => handleAction('touchdown', 6, playerId)}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
              <DroppableActionButton 
                label="FUMBLE" 
                color="bg-red-600 hover:bg-red-700"
                onClick={(playerId) => handleAction('fumble', undefined, playerId)}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
            </div>
          </div>
        </div>

        {/* Extra Points */}
        <div>
          <h3 className="text-xs font-bold text-purple-400 mb-2">Extra Points</h3>
          <div className="overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              <DroppableActionButton 
                label="1 PT" 
                color="bg-purple-600 hover:bg-purple-700" 
                points={1}
                onClick={(playerId) => handleAction('extra_point_1', 1, playerId)}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
              <DroppableActionButton 
                label="2 PT" 
                color="bg-indigo-600 hover:bg-indigo-700" 
                points={2}
                onClick={(playerId) => handleAction('extra_point_2', 2, playerId)}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
            </div>
          </div>
        </div>

        <div className="text-center text-gray-400 mt-3 text-xs">Flag Football Offense</div>
      </CardContent>
    </Card>
  );
};
