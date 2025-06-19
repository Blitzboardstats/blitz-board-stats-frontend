
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PlayerTeamRelationship } from '@/types/playerTypes';
import { toast } from 'sonner';

export const usePlayerTeamRelationships = (playerId?: string) => {
  const [relationships, setRelationships] = useState<PlayerTeamRelationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!playerId) {
      setRelationships([]);
      setIsLoading(false);
      return;
    }

    const fetchRelationships = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('player_team_relationships')
          .select(`
            *,
            team:teams (
              id,
              name,
              football_type,
              age_group,
              season
            )
          `)
          .eq('player_id', playerId)
          .order('joined_at', { ascending: false });

        if (error) {
          console.error('Error fetching player team relationships:', error);
          toast.error('Failed to load team relationships');
          return;
        }

        // Type assertion to ensure proper typing
        const typedRelationships = (data || []).map(rel => ({
          ...rel,
          status: rel.status as 'active' | 'inactive' | 'transferred'
        })) as PlayerTeamRelationship[];

        setRelationships(typedRelationships);
      } catch (error) {
        console.error('Error in fetchRelationships:', error);
        toast.error('Failed to load team relationships');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelationships();
  }, [playerId]);

  const addPlayerToTeam = async (teamId: string) => {
    if (!playerId) return false;

    try {
      const { error } = await supabase
        .from('player_team_relationships')
        .insert({
          player_id: playerId,
          team_id: teamId,
          status: 'active'
        });

      if (error) {
        console.error('Error adding player to team:', error);
        toast.error('Failed to add player to team');
        return false;
      }

      toast.success('Player added to team successfully');
      // Refresh relationships
      const { data } = await supabase
        .from('player_team_relationships')
        .select(`
          *,
          team:teams (
            id,
            name,
            football_type,
            age_group,
            season
          )
        `)
        .eq('player_id', playerId)
        .order('joined_at', { ascending: false });

      if (data) {
        // Type assertion to ensure proper typing
        const typedRelationships = data.map(rel => ({
          ...rel,
          status: rel.status as 'active' | 'inactive' | 'transferred'
        })) as PlayerTeamRelationship[];
        
        setRelationships(typedRelationships);
      }
      
      return true;
    } catch (error) {
      console.error('Error in addPlayerToTeam:', error);
      toast.error('Failed to add player to team');
      return false;
    }
  };

  const removePlayerFromTeam = async (relationshipId: string) => {
    try {
      const { error } = await supabase
        .from('player_team_relationships')
        .update({
          status: 'inactive',
          left_at: new Date().toISOString()
        })
        .eq('id', relationshipId);

      if (error) {
        console.error('Error removing player from team:', error);
        toast.error('Failed to remove player from team');
        return false;
      }

      toast.success('Player removed from team successfully');
      
      // Update local state
      setRelationships(prev => 
        prev.map(rel => 
          rel.id === relationshipId 
            ? { ...rel, status: 'inactive' as const, left_at: new Date().toISOString() }
            : rel
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error in removePlayerFromTeam:', error);
      toast.error('Failed to remove player from team');
      return false;
    }
  };

  const getActiveTeams = () => {
    return relationships.filter(rel => rel.status === 'active');
  };

  return {
    relationships,
    isLoading,
    addPlayerToTeam,
    removePlayerFromTeam,
    getActiveTeams
  };
};
