
import React from 'react';
import { Player } from '@/types/playerTypes';
import { PlayerGuardianIndicator } from './PlayerGuardianIndicator';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, X, Edit } from 'lucide-react';
import { usePlayerPermissions } from '@/hooks/usePlayerPermissions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PlayerListProps {
  players: Player[];
  onPlayerClick: (player: Player) => void;
  onResendInvitation?: (player: Player) => void;
  onRemovePlayer?: (player: Player) => void;
  onEditPlayer?: (player: Player) => void;
  canManageTeam: boolean;
}

const PlayerList = ({ 
  players, 
  onPlayerClick, 
  onResendInvitation,
  onRemovePlayer,
  onEditPlayer,
  canManageTeam 
}: PlayerListProps) => {
  if (!players || players.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No players added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {players.map((player) => {
        // Each player gets its own permission check
        const PlayerRow = ({ player }: { player: Player }) => {
          const { permissions, isLoading } = usePlayerPermissions(player.id);
          
          console.log('=== PlayerList Debug Info ===');
          console.log('Player:', player.name);
          console.log('canManageTeam:', canManageTeam);
          console.log('permissions:', permissions);
          console.log('isLoading:', isLoading);
          console.log('Available handlers:', {
            onEditPlayer: !!onEditPlayer,
            onRemovePlayer: !!onRemovePlayer,
            onResendInvitation: !!onResendInvitation
          });
          
          // Simple logic: show dropdown if user can manage team OR is guardian
          const userCanEdit = canManageTeam || permissions.isGuardian;
          const hasAnyHandler = onEditPlayer || onRemovePlayer || onResendInvitation;
          const showDropdown = userCanEdit && hasAnyHandler;
          
          console.log('Final decision:', {
            userCanEdit,
            hasAnyHandler,
            showDropdown
          });
          console.log('=== End Debug Info ===');
          
          return (
            <div
              key={player.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onPlayerClick(player)}
            >
              <div className="flex items-center space-x-3">
                {player.photo_url ? (
                  <img
                    src={player.photo_url}
                    alt={player.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 font-medium">
                      {player.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {player.name}
                    </h3>
                    <PlayerGuardianIndicator playerId={player.id} />
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {player.position && (
                      <span>{player.position}</span>
                    )}
                    {player.jersey_number && (
                      <span>#{player.jersey_number}</span>
                    )}
                    {player.graduation_year && (
                      <span>Class of {player.graduation_year}</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Always show dropdown if we have any handlers - let individual items handle their own visibility */}
              {hasAnyHandler && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-[9999] min-w-[150px]"
                  >
                    {/* Edit Player - Show if handler exists and user can edit */}
                    {onEditPlayer && userCanEdit && (
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Edit clicked for:', player.name);
                          onEditPlayer(player);
                        }}
                        className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Player
                      </DropdownMenuItem>
                    )}
                    
                    {/* Resend Invitation - Only for team managers */}
                    {onResendInvitation && canManageTeam && (
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Resend invitation clicked for:', player.name);
                          onResendInvitation(player);
                        }}
                        className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Resend Invitation
                      </DropdownMenuItem>
                    )}
                    
                    {/* Remove Player - Show if handler exists and user can edit */}
                    {onRemovePlayer && userCanEdit && (
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Remove clicked for:', player.name);
                          onRemovePlayer(player);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove Player
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        };

        return <PlayerRow key={player.id} player={player} />;
      })}
    </div>
  );
};

export default PlayerList;
