
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';

interface PlayerPermissions {
  canEdit: boolean;
  canView: boolean;
  isGuardian: boolean;
  canManageStats: boolean;
}

export const usePlayerPermissions = (playerId?: string) => {
  const { user, isAdmin } = useAuth();
  const [permissions, setPermissions] = useState<PlayerPermissions>({
    canEdit: false,
    canView: false,
    isGuardian: false,
    canManageStats: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !playerId) {
      console.log('usePlayerPermissions: No user or playerId, setting all permissions to false');
      setPermissions({
        canEdit: false,
        canView: false,
        isGuardian: false,
        canManageStats: false,
      });
      setIsLoading(false);
      return;
    }

    const calculatePermissions = async () => {
      console.log('usePlayerPermissions: Calculating permissions for player:', playerId, 'user:', user.email);
      
      try {
        // Admins can do everything
        if (isAdmin) {
          console.log('usePlayerPermissions: User is admin, granting full permissions');
          setPermissions({
            canEdit: true,
            canView: true,
            isGuardian: false,
            canManageStats: true,
          });
          setIsLoading(false);
          return;
        }

        // Check if user is a guardian of this player using guardian_email - THIS IS THE ONLY WAY TO EDIT
        const { data: playerData, error: playerError } = await supabase
          .from('players')
          .select('guardian_email, team_id')
          .eq('id', playerId)
          .single();

        if (playerError) {
          console.error('usePlayerPermissions: Error fetching player data:', playerError);
        }

        const isGuardian = playerData?.guardian_email === user.email;
        console.log('usePlayerPermissions: Guardian check result:', {
          isGuardian,
          playerGuardianEmail: playerData?.guardian_email,
          userEmail: user.email
        });

        // Check if user can view the player (either guardian or coach)
        let canView = isGuardian;

        // Check if user is a coach for this specific player's team (for viewing only)
        if (playerData?.team_id && !isGuardian) {
          const { data: coachData, error: coachError } = await supabase
            .from('team_coaches')
            .select('team_id')
            .eq('team_id', playerData.team_id)
            .or(`user_id.eq.${user.id},email.eq.${user.email}`);
          
          if (coachError) {
            console.error('usePlayerPermissions: Error checking coach status:', coachError);
          }

          const isCoachForThisTeam = coachData && coachData.length > 0;
          console.log('usePlayerPermissions: Coach check result for team:', playerData.team_id, isCoachForThisTeam);
          
          if (isCoachForThisTeam) {
            canView = true;
          }
        }

        // CRITICAL: Only guardians can edit, coaches can only view
        const canEdit = isGuardian;
        const canManageStats = isGuardian;

        console.log('usePlayerPermissions: Final permissions:', {
          isGuardian,
          canView,
          canEdit,
          canManageStats
        });

        setPermissions({
          canEdit: canEdit,
          canView: canView,
          isGuardian: isGuardian,
          canManageStats: canManageStats,
        });

      } catch (error) {
        console.error('usePlayerPermissions: Error calculating permissions:', error);
        setPermissions({
          canEdit: false,
          canView: false,
          isGuardian: false,
          canManageStats: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    calculatePermissions();
  }, [user, isAdmin, playerId]);

  return { permissions, isLoading };
};
