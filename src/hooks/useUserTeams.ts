import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContextOptimized";

interface UserTeam {
  id: string;
  name: string;
  logo_url?: string;
  football_type: string;
  age_group?: string;
  userRole: "coach" | "member" | "creator";
  roleDetails?: string;
}

export const useUserTeams = () => {
  const [teams, setTeams] = useState<UserTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTeams([]);
      setIsLoading(false);
      return;
    }

    const fetchUserTeams = async () => {
      const allTeams: UserTeam[] = [];
      try {
        setIsLoading(true);

        // Get teams where user is a coach
        if (user.role === "coach") {
          const { data: coachTeams } = await supabase
            .from("team_coaches")
            .select(
              `
              team_id,
              role,
              teams!inner(id, name, logo_url, football_type, age_group)
            `
            )
            .eq("user_id", user.id);

          // Add coach teams
          if (coachTeams) {
            coachTeams.forEach((ct) => {
              allTeams.push({
                id: ct.teams.id,
                name: ct.teams.name,
                logo_url: ct.teams.logo_url,
                football_type: ct.teams.football_type,
                age_group: ct.teams.age_group,
                userRole: "coach",
                roleDetails: ct.role,
              });
            });
          }
          const { data: createdTeams } = await supabase
            .from("teams")
            .select("id, name, logo_url, football_type, age_group")
            .eq("created_by", user.id);

          if (createdTeams) {
            createdTeams.forEach((ct) => {
              if (!allTeams.find((t) => t.id === ct.id)) {
                allTeams.push({
                  id: ct.id,
                  name: ct.name,
                  logo_url: ct.logo_url,
                  football_type: ct.football_type,
                  age_group: ct.age_group,
                  userRole: "creator",
                });
              }
            });
          }
        }

        if (user.role !== "coach") {
          const { data: memberTeams } = await supabase
            .from("team_members")
            .select(
              `
              team_id,
              teams!inner(id, name, logo_url, football_type, age_group)
            `
            )
            .eq("user_id", user.id);

          // Get teams where user is the creator

          // Add member teams (if not already added as coach)
          if (memberTeams) {
            memberTeams.forEach((mt) => {
              if (!allTeams.find((t) => t.id === mt.teams.id)) {
                allTeams.push({
                  id: mt.teams.id,
                  name: mt.teams.name,
                  logo_url: mt.teams.logo_url,
                  football_type: mt.teams.football_type,
                  age_group: mt.teams.age_group,
                  userRole: "member",
                });
              }
            });
          }
        }

        // Get teams where user is a member

        // Add created teams (if not already added)

        setTeams(allTeams);
      } catch (error) {
        console.error("Error fetching user teams:", error);
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTeams();
  }, [user]);

  return { teams, isLoading };
};
