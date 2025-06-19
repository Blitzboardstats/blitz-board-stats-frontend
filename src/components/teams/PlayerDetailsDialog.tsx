
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Player } from '@/types/playerTypes';
import { usePlayerPermissions } from '@/hooks/usePlayerPermissions';
import { PlayerGuardianIndicator } from './PlayerGuardianIndicator';
import { Edit, Trash2, User, Shield, Lock } from 'lucide-react';

interface PlayerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
  onEditPlayer?: () => void;
  onRemovePlayer?: () => void;
}

const PlayerDetailsDialog = ({
  open,
  onOpenChange,
  player,
  onEditPlayer,
  onRemovePlayer
}: PlayerDetailsDialogProps) => {
  const { permissions, isLoading } = usePlayerPermissions(player?.id);

  if (!player) return null;

  // Only allow edit/remove if user is the guardian of this specific player
  const canEdit = permissions.isGuardian && onEditPlayer;
  const canRemove = permissions.isGuardian && onRemovePlayer;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Player Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Player Photo */}
          {player.photo_url && (
            <div className="flex justify-center">
              <img
                src={player.photo_url}
                alt={player.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
            </div>
          )}
          
          {/* Guardian/Permission Indicators */}
          <div className="flex justify-center gap-2">
            <PlayerGuardianIndicator playerId={player.id} />
            {permissions.canView && !permissions.isGuardian && (
              <Badge variant="outline" className="border-blue-500/50 text-blue-600 bg-blue-50">
                <Shield className="w-3 h-3 mr-1" />
                Can View
              </Badge>
            )}
          </div>
          
          {/* Player Info */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="font-semibold">{player.name}</p>
            </div>
            
            {player.position && (
              <div>
                <label className="text-sm font-medium text-gray-500">Position</label>
                <p>{player.position}</p>
              </div>
            )}
            
            {player.jersey_number && (
              <div>
                <label className="text-sm font-medium text-gray-500">Jersey Number</label>
                <p>#{player.jersey_number}</p>
              </div>
            )}
            
            {player.graduation_year && (
              <div>
                <label className="text-sm font-medium text-gray-500">Graduation Year</label>
                <p>{player.graduation_year}</p>
              </div>
            )}
            
            {player.guardian_name && (
              <div>
                <label className="text-sm font-medium text-gray-500">Guardian</label>
                <p>{player.guardian_name}</p>
              </div>
            )}
            
            {player.guardian_email && (
              <div>
                <label className="text-sm font-medium text-gray-500">Guardian Email</label>
                <p className="text-sm text-gray-600">{player.guardian_email}</p>
              </div>
            )}
          </div>
          
          {/* Permission Notice */}
          {!permissions.isGuardian && permissions.canView && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                You can view this player's information but cannot edit it. Only guardians can edit their children's profiles.
              </p>
            </div>
          )}
          
          {!permissions.canView && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                You have limited access to this player's information.
              </p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {canEdit && (
              <Button 
                onClick={onEditPlayer}
                variant="outline"
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Player
              </Button>
            )}
            
            {canRemove && (
              <Button 
                onClick={onRemovePlayer}
                variant="destructive"
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Player
              </Button>
            )}
            
            {!canEdit && !canRemove && (
              <Button 
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDetailsDialog;
