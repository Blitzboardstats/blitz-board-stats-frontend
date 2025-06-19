
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';

export const useUserTeamsQuery = () => {
  const { user, isCoach, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['user-teams', user?.id, user?.role],
    queryFn: async () => {
      if (!user?.id) return [];

      console.log('Fetching role-based teams for user:', user.id, 'role:', user.role);

      let allTeams: any[] = [];

      // For players: get teams ONLY through player_team_relationships
      if (user.role === 'player') {
        console.log('Fetching player teams via relationships ONLY');
        
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
                season
              )
            `)
            .in('player_id', playerIds)
            .eq('status', 'active');

          if (!relationshipError && relationshipTeams) {
            allTeams = relationshipTeams
              .filter(rel => rel.team)
              .map(rel => rel.team);
            console.log('Found teams via player relationships:', allTeams.length);
          }
        }
      }
      
      // For coaches, admins, and statisticians: get teams they created and coach
      else if (isCoach || isAdmin || user.role === 'coach' || user.role === 'assistant_coach' || user.role === 'statistician') {
        console.log('Fetching coach/admin teams for role:', user.role);

        // Get teams where user is a coach
        const { data: coachTeams, error: coachError } = await supabase
          .from('team_coaches')
          .select('team_id, teams!team_coaches_team_id_fkey(id, name, age_group, football_type, logo_url, season)')
          .eq('user_id', user.id);

        if (!coachError && coachTeams) {
          allTeams = [...allTeams, ...coachTeams.map(tc => tc.teams)];
        }

        // Get teams created by user
        const { data: createdTeams, error: createdError } = await supabase
          .from('teams')
          .select('id, name, age_group, football_type, logo_url, season')
          .eq('created_by', user.id);

        if (!createdError && createdTeams) {
          allTeams = [...allTeams, ...createdTeams];
        }

        // Get teams where user is a member
        const { data: memberTeams, error: memberError } = await supabase
          .from('team_members')
          .select('team_id, teams!team_members_team_id_fkey(id, name, age_group, football_type, logo_url, season)')
          .eq('user_id', user.id);

        if (!memberError && memberTeams) {
          allTeams = [...allTeams, ...memberTeams.map(tm => tm.teams)];
        }
      }
      
      // For parents: get teams ONLY from team_members
      else if (user.role === 'parent') {
        console.log('Fetching parent teams from team_members ONLY');

        const { data: memberTeams, error: memberError } = await supabase
          .from('team_members')
          .select('team_id, teams!team_members_team_id_fkey(id, name, age_group, football_type, logo_url, season)')
          .eq('user_id', user.id);

        if (!memberError && memberTeams) {
          allTeams = memberTeams.map(tm => tm.teams);
          console.log('Found teams via team membership:', allTeams.length);
        }
      }

      // Remove duplicates
      const uniqueTeams = allTeams.filter((team, index, self) => 
        index === self.findIndex(t => t.id === team.id)
      );

      console.log('Role-based user teams:', uniqueTeams.length, 'for role:', user.role);
      return uniqueTeams;
    },
    enabled: !!user?.id,
  });
};
