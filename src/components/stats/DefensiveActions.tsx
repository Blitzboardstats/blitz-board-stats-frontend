
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DroppableActionButton } from './DroppableActionButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DefensiveActionsProps {
  canEdit: boolean;
  isGameActive: boolean;
  selectedPlayer?: string;
  onStatUpdate?: (playerId: string, statType: string, points?: number) => void;
}

export const DefensiveActions = ({ 
  canEdit, 
  isGameActive, 
  selectedPlayer,
  onStatUpdate
}: DefensiveActionsProps) => {
  const handleDefensiveAction = (actionType: string, points?: number, playerId?: string) => {
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
    // TODO: Record the defensive action in game session
  };

  const handleInterceptionWithPoints = (pointsString: string) => {
    const points = parseInt(pointsString);
    handleDefensiveAction('interception', points);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-3">
        {/* Primary Defensive Actions */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-red-400 mb-2">Defensive Actions</h3>
          <div className="overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              <DroppableActionButton 
                label="FLAG PULL" 
                color="bg-purple-600 hover:bg-purple-700"
                width="w-20"
                onClick={(playerId) => handleDefensiveAction('flag_pull', undefined, playerId)}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
              <DroppableActionButton 
                label="INT" 
                color="bg-pink-600 hover:bg-pink-700"
                onClick={(playerId) => handleDefensiveAction('interception', undefined, playerId)}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
              <DroppableActionButton 
                label="SACK" 
                color="bg-blue-600 hover:bg-blue-700"
                onClick={(playerId) => handleDefensiveAction('sack', undefined, playerId)}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
              <DroppableActionButton 
                label="SAFETY" 
                color="bg-orange-600 hover:bg-orange-700" 
                points={2}
                width="w-18"
                onClick={(playerId) => handleDefensiveAction('safety', 2, playerId)}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
            </div>
          </div>
        </div>

        {/* Interception Points */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-pink-400 mb-2">INT Points</h3>
          <Select 
            disabled={!canEdit || !isGameActive || !selectedPlayer}
            onValueChange={handleInterceptionWithPoints}
          >
            <SelectTrigger className="w-full h-10 bg-gray-700 border-gray-600 text-white text-xs">
              <SelectValue placeholder="Select points scored on INT" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="1" className="text-white hover:bg-gray-600 text-xs">
                1 Point
              </SelectItem>
              <SelectItem value="2" className="text-white hover:bg-gray-600 text-xs">
                2 Points
              </SelectItem>
              <SelectItem value="6" className="text-white hover:bg-gray-600 text-xs">
                6 Points (Pick 6)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-center text-gray-400 mt-3 text-xs">Flag Football Defense</div>
      </CardContent>
    </Card>
  );
};
