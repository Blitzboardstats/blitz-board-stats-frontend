
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/eventTypes';
import { parseEventDate } from '@/utils/dateUtils';

export const useEvent = (eventId: string | undefined) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;

      console.log('Fetching event with ID:', eventId);

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          teams!inner(name, age_group)
        `)
        .eq('id', eventId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }

      if (!data) {
        console.log('No event found with ID:', eventId);
        return null;
      }

      console.log('Fetched event data:', data);

      return {
        id: data.id,
        title: data.title,
        date: parseEventDate(data.date), // Use safe date parsing
        time: data.time,
        endTime: data.end_time || undefined,
        location: data.location,
        type: data.type as 'Game' | 'Practice' | 'Tournament',
        opponent: data.opponent || undefined,
        teamCount: data.team_count || undefined,
        teamId: data.team_id,
        createdBy: data.created_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        duration: data.duration as 40 | 48 | 50 | undefined,
        matchupFormat: data.matchup_format as 'Halves' | 'Quarters' | undefined,
        ageGroups: data.age_groups || undefined,
      } as Event;
    },
    enabled: !!eventId,
  });
};
