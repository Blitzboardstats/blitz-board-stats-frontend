
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from "@/components/ui/form";
import { Player } from '@/types/playerTypes';
import { useEditPlayer } from '@/hooks/useEditPlayer';
import { PlayerPhotoUpload } from './PlayerPhotoUpload';
import { PlayerBasicFields } from './PlayerBasicFields';
import { GuardianFields } from './GuardianFields';

interface EditPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
  onEditPlayer: (playerId: string, updatedPlayer: Partial<Player>) => Promise<boolean>;
}

const EditPlayerDialog = ({
  open,
  onOpenChange,
  player,
  onEditPlayer
}: EditPlayerDialogProps) => {
  const {
    form,
    playerPhoto,
    setPlayerPhoto,
    isSubmitting,
    originalGuardianEmail,
    handleSubmit
  } = useEditPlayer(player, onEditPlayer, onOpenChange);
  
  if (!player) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blitz-charcoal text-white border-gray-800 sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Player</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <PlayerBasicFields control={form.control} />
            
            <PlayerPhotoUpload 
              playerPhoto={playerPhoto}
              onPhotoChange={setPlayerPhoto}
            />
            
            <GuardianFields 
              control={form.control}
              originalGuardianEmail={originalGuardianEmail}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blitz-purple hover:bg-blitz-purple/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <>Save Changes</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlayerDialog;
