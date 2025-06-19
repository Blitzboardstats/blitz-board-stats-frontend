
import React from 'react';
import { Team } from '@/types/teamTypes';
import DeleteTeamDialog from './DeleteTeamDialog';
import EditTeamDialog from './EditTeamDialog';

interface TeamDetailsManagementDialogsProps {
  isDeleteTeamOpen: boolean;
  setIsDeleteTeamOpen: (open: boolean) => void;
  isEditTeamOpen: boolean;
  setIsEditTeamOpen: (open: boolean) => void;
  team: Team;
  canManageTeam: boolean;
  onDeleteTeam: (teamId: string) => Promise<boolean>;
  onEditTeam: (teamId: string, updatedData: Partial<Team>) => Promise<boolean>;
}

const TeamDetailsManagementDialogs = ({
  isDeleteTeamOpen,
  setIsDeleteTeamOpen,
  isEditTeamOpen,
  setIsEditTeamOpen,
  team,
  canManageTeam,
  onDeleteTeam,
  onEditTeam
}: TeamDetailsManagementDialogsProps) => {
  if (!canManageTeam) return null;

  return (
    <>
      <DeleteTeamDialog 
        open={isDeleteTeamOpen}
        onOpenChange={setIsDeleteTeamOpen}
        team={team}
        onDeleteTeam={onDeleteTeam}
      />
      
      <EditTeamDialog
        open={isEditTeamOpen}
        onOpenChange={setIsEditTeamOpen}
        team={team}
        onEditTeam={onEditTeam}
      />
    </>
  );
};

export default TeamDetailsManagementDialogs;
