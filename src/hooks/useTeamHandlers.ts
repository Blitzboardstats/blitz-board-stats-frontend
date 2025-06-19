import { toast } from "sonner";
import { Player } from "@/types/playerTypes";
import { Team, TeamCoach, TeamMember } from "@/types/teamTypes";
import { useAuth } from "@/contexts/AuthContextOptimized";
import { useInvitationEmail } from "./useInvitationEmail";
import { useInvitationCreation } from "./useInvitationCreation";

interface UseTeamHandlersProps {
  team: Team;
  setSelectedPlayer: (player: Player | null) => void;
  setIsPlayerDetailsOpen: (open: boolean) => void;
  setIsRemovePlayerOpen: (open: boolean) => void;
  setIsEditPlayerOpen: (open: boolean) => void;
  setSelectedCoach: (coach: TeamCoach | null) => void;
  setIsEditCoachOpen: (open: boolean) => void;
  setIsAddCoachOpen: (open: boolean) => void;
  setIsRemoveCoachOpen: (open: boolean) => void;
  canManageTeam: boolean;
  coaches: TeamCoach[];
}

export const useTeamHandlers = ({
  team,
  setSelectedPlayer,
  setIsPlayerDetailsOpen,
  setIsRemovePlayerOpen,
  setIsEditPlayerOpen,
  setSelectedCoach,
  setIsEditCoachOpen,
  setIsAddCoachOpen,
  setIsRemoveCoachOpen,
  canManageTeam,
  coaches,
}: UseTeamHandlersProps) => {
  const { user } = useAuth();
  const { sendInvitationEmail } = useInvitationEmail();
  const { createAndSendInvitation } = useInvitationCreation(
    team?.id,
    team?.name,
    team?.footballType
  );

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsPlayerDetailsOpen(true);
  };

  const handleRemovePlayerClick = () => {
    if (canManageTeam) {
      setIsPlayerDetailsOpen(false);
      setIsRemovePlayerOpen(true);
    }
  };

  const handleEditPlayerClick = () => {
    if (canManageTeam) {
      setIsPlayerDetailsOpen(false);
      setIsEditPlayerOpen(true);
    }
  };

  const handleCoachClick = (coach: TeamCoach) => {
    if (canManageTeam) {
      setSelectedCoach(coach);
      setIsEditCoachOpen(true);
    }
  };

  const handleEditCoachClick = (coach: TeamCoach) => {
    if (canManageTeam) {
      setSelectedCoach(coach);
      setIsEditCoachOpen(true);
    }
  };

  const handleAddCoachClick = () => {
    setIsAddCoachOpen(true);
  };

  const handleRemoveCoachClick = (coach: TeamCoach) => {
    if (canManageTeam) {
      setSelectedCoach(coach);
      setIsRemoveCoachOpen(true);
    }
  };

  const handleRemoveMemberClick = (member: TeamMember) => {
    // This function handles member removal - implementation would go here
    console.log("Remove member:", member);
  };

  const handleResendPlayerInvitation = async (player: Player) => {
    if (!player.guardian_email || !team || !user) {
      toast.error(
        "Cannot resend invitation - missing email or team information"
      );
      return;
    }

    try {
      // Create and send invitation using the creation hook
      const success = await createAndSendInvitation({
        email: player.guardian_email,
        invitationType: "player",
        playerName: player.name,
      });

      if (success) {
        toast.success(`Invitation resent to ${player.guardian_email}`);
      }
    } catch (error) {
      console.error("Error resending player invitation:", error);
      toast.error("Failed to resend invitation");
    }
  };

  const handleResendCoachInvitation = async (coach: TeamCoach) => {
    if (!coach.email || !team || !user) {
      toast.error(
        "Cannot resend invitation - missing email or team information"
      );
      return;
    }

    try {
      // Create and send invitation using the creation hook
      const success = await createAndSendInvitation({
        email: coach.email,
        invitationType: "coach",
        coachRole: coach.role,
      });

      if (success) {
        toast.success(`Invitation resent to ${coach.email}`);
      }
    } catch (error) {
      console.error("Error resending coach invitation:", error);
      toast.error("Failed to resend invitation");
    }
  };

  return {
    handlePlayerClick,
    handleRemovePlayerClick,
    handleEditPlayerClick,
    handleCoachClick,
    handleEditCoachClick,
    handleAddCoachClick,
    handleRemoveCoachClick,
    handleRemoveMemberClick,
    handleResendPlayerInvitation,
    handleResendCoachInvitation,
  };
};
