
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContextOptimized';
import { toast } from 'sonner';
import { Team } from '@/types/teamTypes';

type TeamWithCreatorInfo = Team & { 
  isCreator: boolean;
  playerCount: number;
};

export const useSimplifiedTeamManagement = () => {
  const [allUserTeams, setAllUserTeams] = useState<TeamWithCreatorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isCoach, isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchAllUserTeams = useCallback(async () => {
    if (!user?.id) {
      console.log('useSimplifiedTeamManagement: No user ID');
      setAllUserTeams([]);
      setIsLoading(false);
      return;
    }

    console.log('useSimplifiedTeamManagement: Starting role-based team fetch for user:', user.id, 'role:', user.role);
    setIsLoading(true);
    setError(null);

    try {
      let allTeams: any[] = [];

      // For players: get teams ONLY through player_team_relationships
      if (user.role === 'player') {
        console.log('useSimplifiedTeamManagement: Fetching player teams via relationships ONLY');
        
        // First get player records for this user
        const { data: playerRecords, error: playerError } = await supabase
          .from('players')
          .select('id')
          .eq('user_id', user.id);

        if (!playerError && playerRecords && playerRecords.length > 0) {
          const playerIds = playerRecords.map(p => p.id);
          
          // Get teams through player_team_relationships using player IDs
          const { data: relationshipTeams, error: relationshipError } = await supabase
            .from('player_team_relationships')
            .select(`
              status,
              joined_at,
              left_at,
              team:teams!player_team_relationships_team_id_fkey (
                id,
                name,
                age_group,
                football_type,
                logo_url,
                season,
                created_by,
                coach_id,
                wins,
                losses,
                draws,
                primary_color,
                secondary_color,
                is_active,
                created_at,
                players (*)
              )
            `)
            .in('player_id', playerIds)
            .eq('status', 'active');

          if (!relationshipError && relationshipTeams) {
            allTeams = relationshipTeams
              .filter(rel => rel.team)
              .map(rel => rel.team);
            console.log('useSimplifiedTeamManagement: Found teams via player relationships:', allTeams.length);
          }
        }
      }
      
      // For parents: get teams ONLY from team_members
      else if (user.role === 'parent') {
        console.log('useSimplifiedTeamManagement: Fetching parent teams from team_members ONLY');

        const { data: memberTeams, error: memberError } = await supabase
          .from('team_members')
          .select(`
            team_id,
            teams!team_members_team_id_fkey (
              id,
              name,
              age_group,
              football_type,
              logo_url,
              season,
              created_by,
              coach_id,
              wins,
              losses,
              draws,
              primary_color,
              secondary_color,
              is_active,
              created_at,
              players (*)
            )
          `)
          .eq('user_id', user.id);

        if (!memberError && memberTeams) {
          allTeams = memberTeams.map(tm => tm.teams);
          console.log('useSimplifiedTeamManagement: Found teams via team membership:', allTeams.length);
        }
      }
      
      // For coaches, admins, and statisticians: get teams they created and coach
      else if (isCoach || isAdmin || user.role === 'coach' || user.role === 'assistant_coach' || user.role === 'statistician') {
        console.log('useSimplifiedTeamManagement: Fetching coach/admin teams for role:', user.role);

        // Get teams where user is a coach
        const { data: coachTeams, error: coachError } = await supabase
          .from('team_coaches')
          .select(`
            team_id,
            teams!team_coaches_team_id_fkey (
              id,
              name,
              age_group,
              football_type,
              logo_url,
              season,
              created_by,
              coach_id,
              wins,
              losses,
              draws,
              primary_color,
              secondary_color,
              is_active,
              created_at,
              players (*)
            )
          `)
          .eq('user_id', user.id);

        if (!coachError && coachTeams) {
          allTeams = [...allTeams, ...coachTeams.map(tc => tc.teams)];
        }

        // Get teams created by user
        const { data: createdTeams, error: createdError } = await supabase
          .from('teams')
          .select(`
            id,
            name,
            age_group,
            football_type,
            logo_url,
            season,
            created_by,
            coach_id,
            wins,
            losses,
            draws,
            primary_color,
            secondary_color,
            is_active,
            created_at,
            players (*)
          `)
          .eq('created_by', user.id);

        if (!createdError && createdTeams) {
          allTeams = [...allTeams, ...createdTeams];
        }

        // Get teams where user is a member
        const { data: memberTeams, error: memberError } = await supabase
          .from('team_members')
          .select(`
            team_id,
            teams!team_members_team_id_fkey (
              id,
              name,
              age_group,
              football_type,
              logo_url,
              season,
              created_by,
              coach_id,
              wins,
              losses,
              draws,
              primary_color,
              secondary_color,
              is_active,
              created_at,
              players (*)
            )
          `)
          .eq('user_id', user.id);

        if (!memberError && memberTeams) {
          allTeams = [...allTeams, ...memberTeams.map(tm => tm.teams)];
        }
      }

      // Remove duplicates
      const uniqueTeams = allTeams.filter((team, index, self) => 
        index === self.findIndex(t => t.id === team.id)
      );
      
      console.log('useSimplifiedTeamManagement: Role-based teams found:', uniqueTeams.length, 'for role:', user.role);
      
      // Map teams to include creator info and player count
      const teamsWithPlayerCount = uniqueTeams.map(team => ({
        ...team,
        playerCount: team.players?.length || 0,
        isCreator: team.created_by === user.id
      })) as TeamWithCreatorInfo[];
      
      console.log('useSimplifiedTeamManagement: Successfully loaded role-based teams:', teamsWithPlayerCount.length);
      console.log('Teams found:', teamsWithPlayerCount.map(t => ({ name: t.name, isCreator: t.isCreator })));
      
      setAllUserTeams(teamsWithPlayerCount);
    } catch (error: any) {
      console.error("Error fetching teams:", error.message);
      setError("Failed to load teams");
      toast.error("Failed to load teams");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.role, isCoach, isAdmin]);

  useEffect(() => {
    if (user) {
      fetchAllUserTeams();
    } else {
      setIsLoading(false);
    }
  }, [user, fetchAllUserTeams]);

  return {
    allUserTeams,
    isLoading,
    error,
    fetchAllUserTeams
  };
};
