
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

interface DeleteTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
  onDeleteTeam: (teamId: string) => Promise<boolean>;
}

const DeleteTeamDialog = ({
  open,
  onOpenChange,
  team,
  onDeleteTeam,
}: DeleteTeamDialogProps) => {
  if (!team) return null;

  const handleDelete = async () => {
    const success = await onDeleteTeam(team.id);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-blitz-darkgray border-gray-700 text-gray-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-100">Delete Team</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Are you sure you want to delete the team "{team.name}"? This action cannot be undone.
            All team data, including players and coach information, will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTeamDialog;
