
import React from 'react';
import { TeamCoach } from '@/types/teamTypes';
import AddCoachDialog from './AddCoachDialog';
import EditCoachDialog from './EditCoachDialog';
import RemoveCoachDialog from './RemoveCoachDialog';

interface TeamDetailsCoachDialogsProps {
  isAddCoachOpen: boolean;
  setIsAddCoachOpen: (open: boolean) => void;
  isEditCoachOpen: boolean;
  setIsEditCoachOpen: (open: boolean) => void;
  isRemoveCoachOpen: boolean;
  setIsRemoveCoachOpen: (open: boolean) => void;
  selectedCoach: TeamCoach | null;
  teamId: string;
  canManageTeam: boolean;
  onAddCoach: (coach: TeamCoach) => Promise<boolean>;
  onEditCoach: (coachId: string, updatedCoachData: Partial<TeamCoach>) => Promise<boolean>;
  onRemoveCoach: (coachId: string) => Promise<boolean>;
}

const TeamDetailsCoachDialogs = ({
  isAddCoachOpen,
  setIsAddCoachOpen,
  isEditCoachOpen,
  setIsEditCoachOpen,
  isRemoveCoachOpen,
  setIsRemoveCoachOpen,
  selectedCoach,
  teamId,
  canManageTeam,
  onAddCoach,
  onEditCoach,
  onRemoveCoach
}: TeamDetailsCoachDialogsProps) => {
  if (!canManageTeam) return null;

  return (
    <>
      <AddCoachDialog
        open={isAddCoachOpen}
        onOpenChange={setIsAddCoachOpen}
        onAddCoach={onAddCoach}
        teamId={teamId}
      />

      <EditCoachDialog
        open={isEditCoachOpen}
        onOpenChange={setIsEditCoachOpen}
        coach={selectedCoach}
        onEditCoach={onEditCoach}
        onRemoveCoach={onRemoveCoach}
      />

      <RemoveCoachDialog
        open={isRemoveCoachOpen}
        onOpenChange={setIsRemoveCoachOpen}
        coach={selectedCoach}
        onRemoveCoach={onRemoveCoach}
      />
    </>
  );
};

export default TeamDetailsCoachDialogs;
