
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { toast } from 'sonner';

export interface PlayerInfo {
  id: string;
  name: string;
  jersey_number?: string;
}

export const useBulkRSVP = (eventId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  // Get guardian's children/players
  const getGuardianPlayers = async (): Promise<PlayerInfo[]> => {
    if (!user?.email) return [];

    const { data, error } = await supabase
      .from('players')
      .select('id, name, jersey_number')
      .eq('guardian_email', user.email);

    if (error) {
      console.error('Error fetching guardian players:', error);
      return [];
    }

    return data || [];
  };

  // Bulk RSVP mutation
  const bulkRSVPMutation = useMutation({
    mutationFn: async ({ 
      playerIds, 
      response, 
      notes 
    }: { 
      playerIds: string[]; 
      response: 'yes' | 'no' | 'maybe' | 'pending'; 
      notes?: string;
    }) => {
      if (!eventId) throw new Error('Event ID is required');
      if (playerIds.length === 0) throw new Error('No players selected');

      console.log('Bulk RSVP for players:', { eventId, playerIds, response, notes });

      const updates = playerIds.map(playerId => ({
        event_id: eventId,
        player_id: playerId,
        response: response,
        notes: notes || null,
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('player_event_rsvps')
        .upsert(updates, { 
          onConflict: 'event_id,player_id',
          ignoreDuplicates: false 
        })
        .select(`
          *,
          players!inner(name)
        `);

      if (error) {
        console.error('Error in bulk RSVP:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['player-event-rsvps', eventId] });
      
      const playerNames = data?.map(rsvp => rsvp.players?.name).join(', ');
      toast.success(`RSVP updated for: ${playerNames}`);
      
      // Clear selection after successful update
      setSelectedPlayers([]);
    },
    onError: (error) => {
      console.error('Error in bulk RSVP:', error);
      toast.error('Failed to update RSVPs');
    },
  });

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const selectAllPlayers = (playerIds: string[]) => {
    setSelectedPlayers(playerIds);
  };

  const clearSelection = () => {
    setSelectedPlayers([]);
  };

  return {
    selectedPlayers,
    togglePlayerSelection,
    selectAllPlayers,
    clearSelection,
    bulkRSVP: bulkRSVPMutation.mutate,
    isBulkUpdating: bulkRSVPMutation.isPending,
    getGuardianPlayers,
  };
};
