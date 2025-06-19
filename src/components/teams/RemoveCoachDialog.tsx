
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
import { TeamCoach } from '@/types/teamTypes';
import { Trash2 } from 'lucide-react';

interface RemoveCoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coach: TeamCoach | null;
  onRemoveCoach: (coachId: string) => Promise<boolean>;
}

const RemoveCoachDialog = ({
  open,
  onOpenChange,
  coach,
  onRemoveCoach
}: RemoveCoachDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  if (!coach) return null;
  
  const handleRemove = async () => {
    setIsLoading(true);
    try {
      const success = await onRemoveCoach(coach.id);
      if (success) {
        toast.success(`${coach.name} has been removed from the team`);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error removing coach:', error);
      toast.error('Failed to remove coach');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blitz-darkgray border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle>Remove Coach</DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to remove {coach.name} from the team?
            {coach.user_id && " This will only remove the coach assignment, not the user account."}
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
                <span>Remove Coach</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveCoachDialog;
