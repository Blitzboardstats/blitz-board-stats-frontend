
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { Event } from '@/types/eventTypes';
import { parseEventDate } from '@/utils/dateUtils';

export const useTeamEventsQuery = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['team-events', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      console.log('Fetching events for user:', user.id);

      // Query events directly - RLS policies will filter appropriately
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          teams(name, age_group),
          event_teams(
            id,
            event_id,
            team_id,
            created_at,
            teams!inner(name, age_group)
          )
        `)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      console.log('Events returned from database:', data?.length || 0);

      // Format the events
      const formattedEvents = data.map(event => {
        const eventTeams = event.event_teams ? event.event_teams.map((et: any) => ({
          id: et.id,
          event_id: et.event_id,
          team_id: et.team_id,
          created_at: et.created_at
        })) : [];

        return {
          id: event.id,
          title: event.title,
          date: parseEventDate(event.date), // Use safe date parsing
          time: event.time,
          endTime: event.end_time || undefined,
          location: event.location,
          type: event.type as 'Game' | 'Practice' | 'Tournament',
          opponent: event.opponent || undefined,
          teamCount: event.team_count || undefined,
          teamId: event.team_id,
          createdBy: event.created_by,
          createdAt: event.created_at,
          updatedAt: event.updated_at,
          duration: event.duration as 40 | 48 | 50 | undefined,
          matchupFormat: event.matchup_format as 'Halves' | 'Quarters' | undefined,
          ageGroups: event.age_groups || undefined,
          eventTeams,
        } as Event;
      });

      console.log('Final formatted events:', formattedEvents.length);

      return formattedEvents;
    },
    enabled: !!user?.id,
  });
};
