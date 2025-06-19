
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { toast } from 'sonner';
import { Team } from '@/types/teamTypes';
import { useCreatedTeams } from './useCreatedTeams';
import { useMemberTeams } from './useMemberTeams';
import { useCoachTeams } from './useCoachTeams';
import { useGuardianTeams } from './useGuardianTeams';

// Non-blocking background guardian relationship establishment
const establishGuardianRelationshipsBackground = async (userEmail: string, userId: string) => {
  try {
    console.log("Background: Starting guardian relationships for:", userEmail);
    
    // Import and run in background with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Guardian relationship timeout')), 3000);
    });
    
    const relationshipPromise = (async () => {
      const { establishGuardianRelationshipsOnLogin } = await import('@/utils/guardianUtils');
      await establishGuardianRelationshipsOnLogin(userEmail, userId);
    })();
    
    await Promise.race([relationshipPromise, timeoutPromise]);
    console.log("Background: Guardian relationships established successfully");
  } catch (error) {
    console.warn("Background: Guardian relationship setup failed (non-blocking):", error);
    // This is non-blocking, so we don't propagate the error
  }
};

type TeamWithCreatorInfo = Team & { 
  isCreator: boolean;
  playerCount: number;
};

export const useTeamManagementOptimized = () => {
  const [allUserTeams, setAllUserTeams] = useState<TeamWithCreatorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isCoach, isAdmin } = useAuth();
  const navigate = useNavigate();

  const { fetchCreatedTeams } = useCreatedTeams();
  const { fetchMemberTeams } = useMemberTeams();
  const { fetchCoachTeams } = useCoachTeams();
  const { fetchGuardianTeams } = useGuardianTeams();

  const fetchAllUserTeams = useCallback(async () => {
    if (!user?.id) {
      console.log('useTeamManagement: No user ID available');
      setIsLoading(false);
      return;
    }

    console.log('useTeamManagement: Starting role-based team fetch for user:', user.id, 'role:', user.role);
    setIsLoading(true);
    setError(null);
    
    try {
      // Start guardian relationship establishment in background (completely non-blocking)
      if (user.email) {
        console.log("Starting background guardian relationship establishment");
        // Don't await this - let it run in background
        establishGuardianRelationshipsBackground(user.email, user.id);
      }
      
      // Role-based team fetching
      let allTeams: Team[] = [];
      
      // For players: fetch teams through player_team_relationships
      if (user.role === 'player') {
        console.log("Fetching player teams via relationships for player user ID:", user.id);
        
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          
          // Get teams through player_team_relationships
          const { data: relationshipTeams, error: relationshipError } = await supabase
            .from('player_team_relationships')
            .select(`
              status,
              team:teams!inner (
                id, name, age_group, football_type, logo_url, season, 
                created_by, coach_id, wins, losses, draws, 
                primary_color, secondary_color, is_active, created_at
              ),
              player:players!inner (
                user_id
              )
            `)
            .eq('players.user_id', user.id)
            .eq('status', 'active');

          if (!relationshipError && relationshipTeams && relationshipTeams.length > 0) {
            const playerTeams = relationshipTeams.map(rel => ({
              ...rel.team,
              football_type: rel.team.football_type as 'Tackle' | 'Flag',
              players: [] // Initialize empty players array to match Team type
            })) as Team[];
            allTeams = [...allTeams, ...playerTeams];
            console.log("Player teams fetched via relationships:", playerTeams.length);
          } else {
            // Fallback: get via direct player records
            const { data: directPlayerTeams } = await supabase
              .from('players')
              .select(`
                team_id,
                teams!inner(
                  id, name, age_group, football_type, logo_url, season, 
                  created_by, coach_id, wins, losses, draws, 
                  primary_color, secondary_color, is_active, created_at
                )
              `)
              .eq('user_id', user.id)
              .not('team_id', 'is', null);

            if (directPlayerTeams && directPlayerTeams.length > 0) {
              const fallbackTeams = directPlayerTeams.map(pt => ({
                ...pt.teams,
                football_type: pt.teams.football_type as 'Tackle' | 'Flag',
                players: []
              })) as Team[];
              allTeams = [...allTeams, ...fallbackTeams];
              console.log("Player teams fetched via direct records:", fallbackTeams.length);
            }
          }
        } catch (err) {
          console.warn("Error fetching player teams (non-blocking):", err);
        }
      }
      
      // Always fetch teams where user is a member (all roles can be team members)
      else {
        const memberTeams = await fetchMemberTeams(user.id).catch(err => {
          console.warn("Error fetching member teams (non-blocking):", err);
          return [];
        });
        allTeams = [...allTeams, ...memberTeams];
        console.log("Member teams fetched:", memberTeams.length);

        // For coaches and admins: fetch teams they created and coach
        if (isCoach || isAdmin || user.role === 'coach' || user.role === 'assistant_coach' || user.role === 'statistician') {
          console.log("Fetching coach/admin teams for role:", user.role);
          
          const createdTeams = await fetchCreatedTeams(user.id).catch(err => {
            console.warn("Error fetching created teams (non-blocking):", err);
            return [];
          });
          allTeams = [...allTeams, ...createdTeams];
          console.log("Created teams fetched:", createdTeams.length);

          const coachTeams = await fetchCoachTeams(user.id, user.email).catch(err => {
            console.warn("Error fetching coach teams (non-blocking):", err);
            return [];
          });
          allTeams = [...allTeams, ...coachTeams];
          console.log("Coach teams fetched:", coachTeams.length);
        }

        // For parents: fetch teams through relationships (both user_id and guardian)
        if (user.role === 'parent') {
          console.log("Fetching parent/guardian teams for role:", user.role);
          
          if (user.email) {
            const guardianTeams = await fetchGuardianTeams(user.email).catch(err => {
              console.warn("Error fetching guardian teams (non-blocking):", err);
              return [];
            });
            allTeams = [...allTeams, ...guardianTeams];
            console.log("Guardian teams fetched:", guardianTeams.length);
          }
        }
      }

      // Remove duplicates
      const uniqueTeams = allTeams.filter((team, index, self) => 
        index === self.findIndex(t => t.id === team.id)
      );
      
      console.log("Processed unique teams:", uniqueTeams.length);
      
      const teamsWithPlayerCount = uniqueTeams.map(team => ({
        ...team,
        playerCount: team.players?.length || 0,
        isCreator: team.created_by === user.id
      })) as TeamWithCreatorInfo[];
      
      console.log('useTeamManagement: Successfully loaded role-based teams:', teamsWithPlayerCount.length);
      setAllUserTeams(teamsWithPlayerCount);
    } catch (error: any) {
      console.error("Critical error fetching teams:", error.message);
      setError("Failed to load teams. Please try refreshing.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.email, user?.role, isCoach, isAdmin, fetchCreatedTeams, fetchMemberTeams, fetchCoachTeams, fetchGuardianTeams]);

  useEffect(() => {
    if (user) {
      console.log('useTeamManagement: User available, fetching role-based teams');
      fetchAllUserTeams();
    } else {
      console.log('useTeamManagement: No user, setting loading to false');
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
