
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { toast } from 'sonner';

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  response: 'yes' | 'no' | 'maybe' | 'pending';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useEventRSVP = (eventId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's RSVP for this event
  const { data: userRSVP, isLoading } = useQuery({
    queryKey: ['event-rsvp', eventId, user?.id],
    queryFn: async () => {
      if (!user?.id || !eventId) return null;

      const { data, error } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || null;
    },
    enabled: !!user?.id && !!eventId,
  });

  // Get all RSVPs for this event (for coaches to view)
  const { data: allRSVPs } = useQuery({
    queryKey: ['event-all-rsvps', eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data, error } = await supabase
        .from('event_rsvps')
        .select(`
          *,
          user_profiles!inner(display_name, email)
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!eventId,
  });

  // Update RSVP mutation
  const updateRSVPMutation = useMutation({
    mutationFn: async ({ response, notes }: { response: 'yes' | 'no' | 'maybe' | 'pending'; notes?: string }) => {
      if (!user?.id || !eventId) throw new Error('Missing user or event ID');

      const { data, error } = await supabase
        .from('event_rsvps')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          response: response,
          notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['event-rsvp', eventId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['event-all-rsvps', eventId] });
      
      const responseText = data?.response === 'yes' ? "I'm In" : 
                          data?.response === 'no' ? 'Not Available' : 
                          data?.response === 'maybe' ? 'Maybe' : 'Pending';
      toast.success(`RSVP updated: ${responseText}`);
    },
    onError: (error) => {
      console.error('Error updating RSVP:', error);
      toast.error('Failed to update RSVP');
    },
  });

  return {
    userRSVP,
    allRSVPs,
    isLoading,
    updateRSVP: updateRSVPMutation.mutate,
    isUpdating: updateRSVPMutation.isPending,
  };
};
