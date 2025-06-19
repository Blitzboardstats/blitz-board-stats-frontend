import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContextOptimized";
import { useInvitationStore } from "@/stores";

export const useTeamInvitationsOptimized = () => {
  const { user } = useAuth();
  const { invitations, isLoading, error, getInvitations, respondInvitation } =
    useInvitationStore();

  useEffect(() => {
    if (user?.email) {
      getInvitations();
    }
  }, [user?.email, getInvitations]);

  const acceptInvitation = async (invitationId: string) => {
    await respondInvitation({ invitationId, invitationStatus: "accepted" });
    return true;
  };

  const declineInvitation = async (invitationId: string) => {
    await respondInvitation({ invitationId, invitationStatus: "declined" });
    return true;
  };

  return {
    invitations,
    isLoading,
    error,
    fetchUserInvitations: getInvitations,
    acceptInvitation,
    declineInvitation,
  };
};
