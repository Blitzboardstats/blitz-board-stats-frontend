
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
import { TeamMember } from '@/types/teamTypes';

interface RemoveMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  onConfirmRemove: () => void;
}

const RemoveMemberDialog = ({
  open,
  onOpenChange,
  member,
  onConfirmRemove
}: RemoveMemberDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-blitz-darkgray border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Remove Team Member
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Are you sure you want to remove{' '}
            <span className="font-semibold">
              {member?.display_name || member?.email || 'this member'}
            </span>{' '}
            from the team? This action cannot be undone and they will no longer have access to view this team.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmRemove}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Remove Member
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveMemberDialog;
