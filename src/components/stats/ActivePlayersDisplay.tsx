
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DraggablePlayer } from "./DraggablePlayer";

interface PlayerJersey {
  id: string;
  number: string;
  name: string;
  position?: string;
  isActive: boolean;
}

interface ActivePlayersDisplayProps {
  activePlayers: PlayerJersey[];
  canEdit: boolean;
  isGameActive: boolean;
  onManageRoster: () => void;
  selectedPlayer?: string;
  onPlayerSelect?: (playerId: string) => void;
}

export const ActivePlayersDisplay = ({
  activePlayers,
  canEdit,
  isGameActive,
  onManageRoster,
  selectedPlayer,
  onPlayerSelect,
}: ActivePlayersDisplayProps) => {
  return (
    <Card className='bg-gray-800 border-gray-700'>
      <CardContent className='p-3'>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='text-sm font-bold'>
            Active Players ({activePlayers.length})
          </h3>
          {canEdit && (
            <Button
              onClick={onManageRoster}
              className='bg-blue-600 hover:bg-blue-700 h-7 px-2'
              size='sm'
            >
              <Plus size={12} className='mr-1' />
              <span className='text-xs'>Manage</span>
            </Button>
          )}
        </div>

        {/* Drag and drop instruction */}
        {canEdit && isGameActive && (
          <div className='text-xs text-gray-400 mb-2 text-center'>
            💡 Tap to select • Drag to action buttons below
          </div>
        )}

        {/* Horizontal scrollable player jerseys */}
        <div className='overflow-x-auto'>
          <div className='flex flex-wrap max-h-[400px] w-[600px] content-start gap-2'>
            {activePlayers.map((player) => (
              <DraggablePlayer
                key={player.id}
                player={player}
                isSelected={selectedPlayer === player.id}
                onSelect={onPlayerSelect || (() => {})}
                canEdit={canEdit}
                isGameActive={isGameActive}
              />
            ))}
          </div>
        </div>

        {selectedPlayer && (
          <div className='mt-2 text-xs text-yellow-400 text-center'>
            Player #{activePlayers.find((p) => p.id === selectedPlayer)?.name}{" "}
            selected
          </div>
        )}
      </CardContent>
    </Card>
  );
};
