
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Team } from '@/types/teamTypes';

interface LeaveTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
  onConfirmLeave: () => void;
}

const LeaveTeamDialog = ({
  open,
  onOpenChange,
  team,
  onConfirmLeave
}: LeaveTeamDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-blitz-darkgray border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Leave Team
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Are you sure you want to leave{' '}
            <span className="font-semibold">
              {team?.name}
            </span>? 
            You will no longer have access to view this team and will need to be re-invited to join again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmLeave}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Leave Team
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LeaveTeamDialog;
