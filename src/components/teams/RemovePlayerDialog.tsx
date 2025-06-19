
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Player } from '@/types/playerTypes';
import { Trash2 } from 'lucide-react';

interface RemovePlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
  onRemovePlayer: (playerId: string) => Promise<boolean>;
}

const RemovePlayerDialog = ({
  open,
  onOpenChange,
  player,
  onRemovePlayer
}: RemovePlayerDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  if (!player) return null;
  
  const handleRemove = async () => {
    setIsLoading(true);
    try {
      const success = await onRemovePlayer(player.id);
      if (success) {
        toast.success(`${player.name} has been removed from the team`);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error removing player:', error);
      toast.error('Failed to remove player');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blitz-darkgray border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle>Remove Player</DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to remove {player.name} from the team?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline" className="border-gray-600">Cancel</Button>
          </DialogClose>
          <Button 
            variant="destructive" 
            onClick={handleRemove}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Removing...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Remove Player</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemovePlayerDialog;
