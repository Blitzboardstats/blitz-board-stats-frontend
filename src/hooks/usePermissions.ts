import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContextOptimized";
import { useAuthStore } from "@/stores";

interface UserPermissions {
  canViewAllPlayerStats: boolean;
  canViewPlayerStats: (
    playerId: string,
    playerGuardianEmail?: string
  ) => Promise<boolean>;
  canManagePlayerStats: (
    playerId: string,
    playerGuardianEmail?: string
  ) => Promise<boolean>;
  isPlayerGuardian: (playerId: string) => Promise<boolean>;
  isGuardianForAnyPlayer: boolean;
  canManageTeam: boolean;
  canCreateEvents: boolean;
}

export const usePermissions = (teamId?: string) => {
  const { user } = useAuthStore();
  const isAdmin = user.isSystemAdmin;
  const [permissions, setPermissions] = useState<UserPermissions>({
    canViewAllPlayerStats: false,
    canViewPlayerStats: async () => false,
    canManagePlayerStats: async () => false,
    isPlayerGuardian: async () => false,
    isGuardianForAnyPlayer: false,
    canManageTeam: false,
    canCreateEvents: false,
  });

  useEffect(() => {
    if (!user) {
      console.log("usePermissions: No user, setting all permissions to false");
      setPermissions({
        canViewAllPlayerStats: false,
        canViewPlayerStats: async () => false,
        canManagePlayerStats: async () => false,
        isPlayerGuardian: async () => false,
        isGuardianForAnyPlayer: false,
        canManageTeam: false,
        canCreateEvents: false,
      });
      return;
    }

    const calculatePermissions = async () => {
      console.log(
        "usePermissions: Calculating permissions for user:",
        user.email,
        "role:",
        user.role,
        "isAdmin:",
        isAdmin,
        "teamId:",
        teamId
      );

      // Check if user has management roles (coach, admin, assistant_coach, etc.)
      const hasManagementRole =
        user.role === "coach" ||
        user.role === "admin" ||
        user.role === "assistant_coach" ||
        isAdmin;
      console.log(
        "usePermissions: User has management role:",
        hasManagementRole
      );

      // Admins and coaches can view/manage all stats and create events
      if (hasManagementRole) {
        console.log(
          "usePermissions: User has management role, granting full permissions"
        );
        setPermissions({
          canViewAllPlayerStats: true,
          canViewPlayerStats: async () => true,
          canManagePlayerStats: async () => true,
          isPlayerGuardian: async () => false,
          isGuardianForAnyPlayer: false,
          canManageTeam: true,
          canCreateEvents: true,
        });
        return;
      }

      // Check if user is a coach for any team (or specific team if provided)
      let coachQuery = supabase
        .from("team_coaches")
        .select("team_id, role")
        .or(`user_id.eq.${user.id},email.eq.${user.email}`);

      if (teamId) {
        coachQuery = coachQuery.eq("team_id", teamId);
      }

      const { data: coachData, error: coachError } = await coachQuery;

      if (coachError) {
        console.error(
          "usePermissions: Error checking coach status:",
          coachError
        );
      }

      const isCoach = coachData && coachData.length > 0;
      console.log(
        "usePermissions: Coach check result:",
        isCoach,
        "for teams:",
        coachData
      );

      // Check if user is a team creator for any team (or specific team if provided)
      let creatorQuery = supabase
        .from("teams")
        .select("id")
        .eq("created_by", user.id);

      if (teamId) {
        creatorQuery = creatorQuery.eq("id", teamId);
      }

      const { data: creatorData, error: creatorError } = await creatorQuery;

      if (creatorError) {
        console.error(
          "usePermissions: Error checking creator status:",
          creatorError
        );
      }

      const isCreator = creatorData && creatorData.length > 0;
      console.log(
        "usePermissions: Creator check result:",
        isCreator,
        "for teams:",
        creatorData
      );

      // Also check if user is a team member with management rights
      let memberQuery = supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id);

      if (teamId) {
        memberQuery = memberQuery.eq("team_id", teamId);
      }

      const { data: memberData, error: memberError } = await memberQuery;

      if (memberError) {
        console.error(
          "usePermissions: Error checking member status:",
          memberError
        );
      }

      const isMember = memberData && memberData.length > 0;
      console.log(
        "usePermissions: Member check result:",
        isMember,
        "for teams:",
        memberData
      );

      // Check if user is a guardian for any players on this team
      let guardianQuery = supabase
        .from("player_guardians")
        .select("player_id, players!inner(team_id)")
        .eq("guardian_user_id", user.id);

      if (teamId) {
        guardianQuery = guardianQuery.eq("players.team_id", teamId);
      }

      const { data: guardianData, error: guardianError } = await guardianQuery;

      if (guardianError) {
        console.error(
          "usePermissions: Error checking guardian status:",
          guardianError
        );
      }

      const isGuardianForAnyPlayer = guardianData && guardianData.length > 0;
      console.log(
        "usePermissions: Guardian check result:",
        isGuardianForAnyPlayer,
        "for players:",
        guardianData
      );

      // Determine management capabilities
      const canManageTeam =
        hasManagementRole || isCoach || isMember || isCreator;
      const canViewAllStats = canManageTeam;
      const canCreateEvents = canManageTeam; // Team managers can create events

      console.log("usePermissions: Final permissions:", {
        canViewAllPlayerStats: canViewAllStats,
        isGuardianForAnyPlayer,
        canManageTeam,
        canCreateEvents,
      });

      setPermissions({
        canViewAllPlayerStats: canViewAllStats,
        isGuardianForAnyPlayer: isGuardianForAnyPlayer,
        canManageTeam: canManageTeam,
        canCreateEvents: canCreateEvents,
        canViewPlayerStats: async (
          playerId: string,
          playerGuardianEmail?: string
        ) => {
          // Coaches/members/creators can view all player stats
          if (canViewAllStats) {
            console.log(
              "usePermissions: Coach/member/creator can view stats for player:",
              playerId
            );
            return true;
          }

          // Check if user is a guardian of this specific player
          try {
            const { data: isGuardianResult, error } = await supabase.rpc(
              "can_view_player_stats",
              {
                player_id_param: playerId,
                user_id_param: user.id,
              }
            );

            if (error) {
              console.error(
                "usePermissions: Error checking guardian view permission:",
                error
              );
              return false;
            }

            const canView = isGuardianResult || false;
            console.log(
              "usePermissions: Guardian view check for player:",
              playerId,
              "result:",
              canView
            );
            return canView;
          } catch (error) {
            console.error("usePermissions: Error in guardian check:", error);
            return false;
          }
        },
        canManagePlayerStats: async (
          playerId: string,
          playerGuardianEmail?: string
        ) => {
          // Coaches/members/creators can manage all stats
          if (canViewAllStats) {
            console.log(
              "usePermissions: Coach/member/creator can manage stats for player:",
              playerId
            );
            return true;
          }

          // Check if user is a guardian of this specific player
          try {
            const { data: isGuardianResult, error } = await supabase.rpc(
              "is_player_guardian",
              {
                player_id_param: playerId,
                user_id_param: user.id,
              }
            );

            if (error) {
              console.error(
                "usePermissions: Error checking guardian manage permission:",
                error
              );
              return false;
            }

            const canManage = isGuardianResult || false;
            console.log(
              "usePermissions: Guardian manage check for player:",
              playerId,
              "result:",
              canManage
            );
            return canManage;
          } catch (error) {
            console.error(
              "usePermissions: Error in guardian manage check:",
              error
            );
            return false;
          }
        },
        isPlayerGuardian: async (playerId: string) => {
          try {
            const { data: isGuardianResult, error } = await supabase.rpc(
              "is_player_guardian",
              {
                player_id_param: playerId,
                user_id_param: user.id,
              }
            );

            if (error) {
              console.error(
                "usePermissions: Error checking if user is guardian:",
                error
              );
              return false;
            }

            return isGuardianResult || false;
          } catch (error) {
            console.error("usePermissions: Error in guardian check:", error);
            return false;
          }
        },
      });
    };

    calculatePermissions();
  }, [user, isAdmin, teamId]);

  return { permissions };
};
