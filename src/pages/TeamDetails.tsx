/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useParams } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import TeamHeader from "@/components/teams/TeamHeader";
import TeamActions from "@/components/teams/TeamActions";
import SimplifiedTeamTabs from "@/components/teams/SimplifiedTeamTabs";
import TeamDetailsPlayerDialogs from "@/components/teams/TeamDetailsPlayerDialogs";
import TeamDetailsCoachDialogs from "@/components/teams/TeamDetailsCoachDialogs";
import TeamDetailsManagementDialogs from "@/components/teams/TeamDetailsManagementDialogs";
import TeamAccessControl from "@/components/teams/TeamAccessControl";
import { useTeamDetails } from "@/hooks/useTeamDetails";
import { useTeamDialogs } from "@/hooks/useTeamDialogs";
import { useTeamHandlers } from "@/hooks/useTeamHandlers";
import { useStatsImport } from "@/hooks/useStatsImport";
import { useAuthStore, useTeamStore } from "@/stores";

const TeamDetails = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuthStore();
  const { teams: userTeams } = useTeamStore();

  const {
    team,
    coaches,
    teamMembers,
    hasTeamAccess,
    canManageTeam,
    isLoading,
    playersLoading,
    playersError,
    handleAddPlayer,
    handleRemovePlayer,
    handleEditPlayer,
    handleAddCoach,
    handleRemoveCoach,
    handleEditCoach,
    handleRemoveMember,
    handleDeleteTeam,
    handleEditTeam,
    fetchTeam,
    players,
  } = useTeamDetails(teamId);

  const dialogStates = useTeamDialogs();

  const teamHandlers = useTeamHandlers({
    team,
    setSelectedPlayer: dialogStates.setSelectedPlayer,
    setIsPlayerDetailsOpen: dialogStates.setIsPlayerDetailsOpen,
    setIsRemovePlayerOpen: dialogStates.setIsRemovePlayerOpen,
    setIsEditPlayerOpen: dialogStates.setIsEditPlayerOpen,
    setSelectedCoach: dialogStates.setSelectedCoach,
    setIsEditCoachOpen: dialogStates.setIsEditCoachOpen,
    setIsAddCoachOpen: dialogStates.setIsAddCoachOpen,
    setIsRemoveCoachOpen: dialogStates.setIsRemoveCoachOpen,
    canManageTeam,
    coaches: coaches || [],
  });

  const { handleImportGameStats } = useStatsImport(team);

  // Create a wrapper function to match the expected signature for TeamActions
  const handleImportStatsWrapper = async (stats: any[]) => {
    // For now, we'll need basic game info - this should be enhanced later
    const gameInfo = {
      opponent: "TBD",
      gameDate: new Date().toISOString().split("T")[0],
      gameType: "game",
      isHomeGame: true,
      quarter: 1,
    };

    return await handleImportGameStats(stats, gameInfo);
  };

  // Create a wrapper function to match the expected signature
  const handleRemoveMemberWrapper = (member: any) => {
    if (canManageTeam) {
      handleRemoveMember(member.id);
    }
  };

  const handleTeamUpdate = (updatedData: Partial<typeof team>) => {
    // Refresh team data when logo is updated
    fetchTeam();
  };

  const handleEditTeamWrapper = async (
    teamId: string,
    updatedTeamData: Partial<typeof team>
  ) => {
    return await handleEditTeam(teamId, updatedTeamData);
  };

  // Create retry function for players
  const handleRetryPlayers = () => {
    console.log("TeamDetails: Retrying player fetch...");
    // The useTeamDetails hook already has retry logic built in
    window.location.reload();
  };

  console.log("TeamDetails: Rendering team page for:", team?.name);

  console.log({ players });

  return (
    <TeamAccessControl
      isLoading={isLoading}
      team={team}
      hasTeamAccess={hasTeamAccess}
    >
      <div className='pb-21'>
        <div className='p-5'>
          <TeamHeader
            team={team}
            canManageTeam={canManageTeam}
            onTeamUpdate={handleTeamUpdate}
          />

          {/* Only show team management actions for team managers */}
          {canManageTeam && team && (
            <TeamActions
              team={team}
              players={team.players || []}
              userTeams={userTeams}
              onAddPlayer={handleAddPlayer}
              onEditTeam={handleEditTeamWrapper}
              onDeleteTeam={handleDeleteTeam}
              onImportStats={handleImportStatsWrapper}
              onAddCoach={teamHandlers.handleAddCoachClick}
              canManageTeam={canManageTeam}
            />
          )}

          {team && (
            <SimplifiedTeamTabs
              players={players || []}
              coaches={coaches || []}
              members={teamMembers || []}
              teamId={team._id}
              teamName={team.name}
              ageGroup={team.ageGroup}
              onPlayerClick={teamHandlers.handlePlayerClick}
              onCoachClick={teamHandlers.handleCoachClick}
              onRemoveCoach={
                canManageTeam ? teamHandlers.handleRemoveCoachClick : undefined
              }
              onEditCoach={
                canManageTeam ? teamHandlers.handleEditCoachClick : undefined
              }
              onRemoveMember={
                canManageTeam ? handleRemoveMemberWrapper : undefined
              }
              onResendPlayerInvitation={
                canManageTeam
                  ? teamHandlers.handleResendPlayerInvitation
                  : undefined
              }
              onResendCoachInvitation={
                canManageTeam
                  ? teamHandlers.handleResendCoachInvitation
                  : undefined
              }
              canManageTeam={canManageTeam}
              playersLoading={playersLoading}
              playersError={playersError}
              onRetryPlayers={handleRetryPlayers}
            />
          )}
        </div>

        {team && (
          <>
            <TeamDetailsPlayerDialogs
              {...dialogStates}
              teamId={team._id}
              canManageTeam={canManageTeam}
              onAddPlayer={handleAddPlayer}
              onEditPlayer={handleEditPlayer}
              onRemovePlayer={handleRemovePlayer}
              onRemovePlayerClick={teamHandlers.handleRemovePlayerClick}
              onEditPlayerClick={teamHandlers.handleEditPlayerClick}
            />

            <TeamDetailsCoachDialogs
              {...dialogStates}
              teamId={team._id}
              canManageTeam={canManageTeam}
              onAddCoach={handleAddCoach}
              onEditCoach={handleEditCoach}
              onRemoveCoach={handleRemoveCoach}
            />

            <TeamDetailsManagementDialogs
              {...dialogStates}
              team={team}
              canManageTeam={canManageTeam}
              onDeleteTeam={handleDeleteTeam}
              onEditTeam={handleEditTeam}
            />
          </>
        )}

        <BottomNav />
      </div>
    </TeamAccessControl>
  );
};

export default TeamDetails;
