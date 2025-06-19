import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';

export interface TeamParent {
  id: string;
  name: string;
  email: string;
  playerName: string;
  teamName: string;
  teamId: string;
  lastActive: string;
  hasAccount: boolean;
}

export const useTeamParents = () => {
  const [parents, setParents] = useState<TeamParent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isCoach } = useAuth();

  const fetchTeamParents = async () => {
    if (!user?.id || !isCoach) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get teams that the coach manages
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('id, name')
        .eq('coach_id', user.id);

      if (teamsError) throw teamsError;

      if (!teams || teams.length === 0) {
        setParents([]);
        return;
      }

      const teamIds = teams.map(team => team.id);

      // Get players from those teams with guardian information
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('name, guardian_name, guardian_email, team_id, teams(name)')
        .in('team_id', teamIds)
        .not('guardian_email', 'is', null)
        .not('guardian_name', 'is', null);

      if (playersError) throw playersError;

      if (!players || players.length === 0) {
        setParents([]);
        return;
      }

      // Get unique guardian emails
      const guardianEmails = Array.from(new Set(players.map(p => p.guardian_email).filter(Boolean)));

      // Check which guardian emails have active accounts
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('email, display_name')
        .in('email', guardianEmails);

      if (profilesError) throw profilesError;

      const activeEmails = new Set((profiles || []).map(p => p.email));

      // Transform the data into TeamParent format
      const parentsData: TeamParent[] = (players || []).map(player => ({
        id: `${player.team_id}-${player.guardian_email}`,
        name: player.guardian_name || 'Unknown Guardian',
        email: player.guardian_email || '',
        playerName: player.name,
        teamName: (player.teams as any)?.name || 'Unknown Team',
        teamId: player.team_id,
        lastActive: activeEmails.has(player.guardian_email) ? 'Active' : 'No account',
        hasAccount: activeEmails.has(player.guardian_email)
      }));

      // Remove duplicates based on email (in case a parent has multiple kids on the team)
      const uniqueParents = parentsData.reduce((acc, current) => {
        const existingParent = acc.find(parent => parent.email === current.email && parent.teamId === current.teamId);
        if (!existingParent) {
          acc.push(current);
        } else {
          // If parent already exists, combine player names
          existingParent.playerName = `${existingParent.playerName}, ${current.playerName}`;
        }
        return acc;
      }, [] as TeamParent[]);

      // Sort by hasAccount (active accounts first)
      uniqueParents.sort((a, b) => {
        if (a.hasAccount && !b.hasAccount) return -1;
        if (!a.hasAccount && b.hasAccount) return 1;
        return a.name.localeCompare(b.name);
      });

      setParents(uniqueParents);
    } catch (error) {
      console.error('Error fetching team parents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamParents();
  }, [user?.id, isCoach]);

  return {
    parents,
    loading,
    refetch: fetchTeamParents
  };
};
