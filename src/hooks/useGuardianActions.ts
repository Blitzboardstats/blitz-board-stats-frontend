
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useGuardianActions = (playerData: any, refetchPlayerData: () => Promise<void>, refetchGuardians: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingRelationship, setIsDeletingRelationship] = useState(false);

  const handleCreateGuardianRelationship = async (guardianEmail: string, guardianName: string) => {
    if (!guardianEmail.trim()) {
      toast.error('Please enter a guardian email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guardianEmail.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!playerData) {
      toast.error('No player record found. Please contact support.');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: guardianUser, error: userError } = await supabase
        .from('user_profiles')
        .select('id, display_name, email')
        .eq('email', guardianEmail.trim().toLowerCase())
        .maybeSingle();

      if (userError) {
        console.error('Error finding guardian user:', userError);
        toast.error('Error searching for guardian account');
        return;
      }

      if (guardianUser) {
        const { error: relationshipError } = await supabase
          .from('player_guardians')
          .insert({
            player_id: playerData.id,
            guardian_user_id: guardianUser.id,
            relationship_type: 'parent',
            can_edit: true,
            can_view_stats: true
          });

        if (relationshipError) {
          if (relationshipError.code === '23505') {
            toast.error('Guardian relationship already exists');
          } else {
            console.error('Error creating guardian relationship:', relationshipError);
            toast.error('Failed to create guardian relationship');
          }
          return;
        }

        toast.success(`Guardian relationship created with ${guardianUser.display_name || guardianUser.email}`);
      } else {
        toast.info('Guardian account not found. Guardian email saved - they can create an account later to access your information.');
      }

      const { error: updateError } = await supabase
        .from('players')
        .update({
          guardian_email: guardianEmail.trim().toLowerCase(),
          guardian_name: guardianName.trim() || null
        })
        .eq('id', playerData.id);

      if (updateError) {
        console.error('Error updating player guardian info:', updateError);
        toast.error('Failed to save guardian information');
        return;
      }

      await refetchPlayerData();
      await refetchGuardians();
      
    } catch (error) {
      console.error('Error creating guardian relationship:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRelationship = async (relationshipId: string, guardianName?: string) => {
    if (!relationshipId) {
      toast.error('Invalid relationship ID');
      return;
    }

    setIsDeletingRelationship(true);
    
    try {
      const { error } = await supabase
        .from('player_guardians')
        .delete()
        .eq('id', relationshipId);

      if (error) {
        console.error('Error deleting guardian relationship:', error);
        toast.error('Failed to remove guardian relationship');
        return;
      }

      toast.success(`Removed guardian relationship with ${guardianName || 'guardian'}`);
      await refetchGuardians();
    } catch (error) {
      console.error('Error deleting guardian relationship:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeletingRelationship(false);
    }
  };

  return {
    isLoading,
    isDeletingRelationship,
    handleCreateGuardianRelationship,
    handleDeleteRelationship
  };
};
