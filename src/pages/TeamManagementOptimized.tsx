/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Team } from "@/types/teamTypes";
import { useTeamInvitationsOptimized } from "@/hooks/useTeamInvitationsOptimized";
import { useTeamLeaving } from "@/hooks/useTeamLeaving";

// Components
import TeamManagementHeader from "@/components/teams/TeamManagementHeader";
import InvitationBanner from "@/components/teams/InvitationBanner";
import ErrorDisplay from "@/components/teams/ErrorDisplay";
import LoadingState from "@/components/teams/LoadingState";
import EmptyTeamsState from "@/components/teams/EmptyTeamsState";
import TeamGrid from "@/components/teams/TeamGrid";
import CreateTeamDialog from "@/components/teams/CreateTeamDialog";
import LeaveTeamDialog from "@/components/teams/LeaveTeamDialog";
import PendingInvitationsDialog from "@/components/teams/PendingInvitationsDialog";
import { useAuthStore, useTeamStore } from "@/stores";

// Extend Team type to include isCreator property
type TeamWithCreatorInfo = Team & {
  isCreator: boolean;
  playerCount: number;
};

const TeamManagement = () => {
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [selectedTeamToLeave, setSelectedTeamToLeave] = useState<Team | null>(
    null
  );
  const [isInvitationsDialogOpen, setIsInvitationsDialogOpen] = useState(false);
  const [showInvitationBanner, setShowInvitationBanner] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isCoach = user?.role === "coach";

  const {
    teams: allUserTeams,
    isLoading: teamsLoading,
    error: teamsError,
    createTeam,
    getTeams: fetchAllUserTeams,
  } = useTeamStore();

  useEffect(() => {
    fetchAllUserTeams();
  }, []);

  console.log({
    teams: allUserTeams,
    isLoading: teamsLoading,
    error: teamsError,
    createTeam,
    getTeams: fetchAllUserTeams,
  });

  const {
    invitations,
    isLoading: invitationsLoading,
    acceptInvitation,
    declineInvitation,
    error: invitationsError,
    fetchUserInvitations,
  } = useTeamInvitationsOptimized();

  const { leaveTeam } = useTeamLeaving();

  console.log("TeamManagement: loading states", {
    invitationsLoading,
    teamsLoading,
    teamsCount: allUserTeams.length,
    invitationsCount: invitations.length,
    hasInvitationsError: !!invitationsError,
  });

  // Check for invitations when user logs in or page loads
  useEffect(() => {
    if (user) {
      fetchUserInvitations();
    }
  }, [user, fetchUserInvitations]);

  const handleCreateTeam = async (newTeam: Team) => {
    const success = await createTeam(newTeam);
    if (success) {
      fetchAllUserTeams();
      setIsCreateTeamOpen(false);
    }
  };

  const handleTeamClick = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };

  const handleLeaveTeamClick = (team: TeamWithCreatorInfo) => {
    setSelectedTeamToLeave(team);
    setIsLeaveDialogOpen(true);
  };

  const handleConfirmLeaveTeam = async () => {
    if (!selectedTeamToLeave || !user?.id) return;

    const success = await leaveTeam(selectedTeamToLeave, user.id);
    if (success) {
      fetchAllUserTeams();
      setIsLeaveDialogOpen(false);
      setSelectedTeamToLeave(null);
    }
  };

  // Auto-show invitations if there are pending ones
  useEffect(() => {
    if (user && invitations.length > 0 && showInvitationBanner) {
      const timer = setTimeout(() => {
        setIsInvitationsDialogOpen(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [user, invitations.length, showInvitationBanner]);

  const handleAcceptInvitation = async (invitationId: string) => {
    console.log("handleAcceptInvitation", invitationId);
    const success = await acceptInvitation(invitationId);
    if (success) {
      // Refresh teams list after accepting invitation
      fetchAllUserTeams();
      // Refresh invitations list
      fetchUserInvitations();
    }
    return success;
  };

  const handleRetry = () => {
    fetchAllUserTeams();
    fetchUserInvitations();
  };

  return (
    <div className="pb-20">
      <div className="p-4">
        <TeamManagementHeader
          isCoach={isCoach}
          isLoading={teamsLoading}
          onCreateTeam={() => setIsCreateTeamOpen(true)}
        />

        <InvitationBanner
          invitations={invitations}
          showBanner={showInvitationBanner}
          onViewInvitations={() => setIsInvitationsDialogOpen(true)}
          onDismiss={() => setShowInvitationBanner(false)}
          isLoading={invitationsLoading}
          error={invitationsError}
        />

        {/* Error states - only show for actual team loading errors */}
        {teamsError && (
          <ErrorDisplay
            title="Failed to load teams"
            message={teamsError}
            onRetry={handleRetry}
            variant="error"
          />
        )}

        {teamsLoading ? (
          <LoadingState />
        ) : allUserTeams.length === 0 ? (
          <EmptyTeamsState
            isCoach={isCoach}
            onCreateTeam={() => setIsCreateTeamOpen(true)}
          />
        ) : (
          <TeamGrid
            teams={allUserTeams}
            onTeamClick={handleTeamClick}
            onLeaveTeam={handleLeaveTeamClick}
          />
        )}
      </div>

      {isCoach && (
        <CreateTeamDialog
          open={isCreateTeamOpen}
          onOpenChange={setIsCreateTeamOpen}
          onCreateTeam={handleCreateTeam}
          userId={user?.id || ""}
        />
      )}

      <LeaveTeamDialog
        open={isLeaveDialogOpen}
        onOpenChange={setIsLeaveDialogOpen}
        team={selectedTeamToLeave}
        onConfirmLeave={handleConfirmLeaveTeam}
      />

      {/* Enhanced pending invitations dialog */}
      <PendingInvitationsDialog
        open={isInvitationsDialogOpen}
        onOpenChange={setIsInvitationsDialogOpen}
        invitations={invitations}
        onAccept={handleAcceptInvitation}
        onDecline={declineInvitation}
        isLoading={invitationsLoading}
      />

      <BottomNav />
    </div>
  );
};

export default TeamManagement;
