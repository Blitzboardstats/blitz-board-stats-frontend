import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TeamMember } from "@/types/teamTypes";
import { useAuthStore, useTeamStore } from "@/stores";
import { UserRole } from "@/api/auth";

export const useTeamDetails = (teamId: string | undefined) => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuthStore();
  const {
    currentTeam: team,
    players,
    coaches,
    isLoading,
    error,
    getTeam,
    getTeamPlayers,
    getTeamCoaches,
  } = useTeamStore();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [hasTeamAccess, setHasTeamAccess] = useState(true);
  const [isTeamCoach, setIsTeamCoach] = useState(false);
  const [isTeamCreator, setIsTeamCreator] = useState(false);

  // Computed property for team management permissions

  useEffect(() => {
    if (team) {
      setIsTeamCreator(team.isCreator);
      // setIsTeamCoach(team.);
    }
  }, [team]);

  const canManageTeam = isTeamCreator || isTeamCoach || user.isSystemAdmin;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      toast.error("You must be logged in to view team details");
      navigate("/login");
      return;
    }
    if (!teamId) return;

    // Fetch team, players, and coaches from the store (API)
    getTeam(teamId);
    getTeamPlayers(teamId);
    getTeamCoaches(teamId);
    if (team) {
      setHasTeamAccess(true);
    }
  }, [
    teamId,
    user,
    authLoading,
    navigate,
    getTeam,
    getTeamPlayers,
    getTeamCoaches,
  ]);

  // TODO: migrate teamMembers and access logic to API/store if needed

  return {
    team,
    coaches,
    teamMembers,
    hasTeamAccess,
    canManageTeam,
    isLoading,
    playersLoading: isLoading, // Use store loading for now
    playersError: error,
    players,
    // The rest of the handlers can be migrated as needed
    handleAddPlayer: async () => false,
    handleRemovePlayer: async () => false,
    handleEditPlayer: async () => false,
    handleAddCoach: async () => false,
    handleRemoveCoach: async () => false,
    handleEditCoach: async () => false,
    handleRemoveMember: async () => false,
    handleDeleteTeam: async () => false,
    handleEditTeam: async () => false,
    fetchTeam: async () => {},
  };
};
