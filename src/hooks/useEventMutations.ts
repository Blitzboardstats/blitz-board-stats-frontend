
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NewEventForm } from '@/types/eventTypes';
import { toast } from 'sonner';

export const useEventMutations = () => {
  const queryClient = useQueryClient();

  // Create event mutation with enhanced RSVP creation
  const createEventMutation = useMutation({
    mutationFn: async (newEvent: NewEventForm) => {
      // Get the current user session to ensure authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user?.id) {
        console.error('Authentication error:', sessionError);
        throw new Error('User not authenticated. Please log in and try again.');
      }

      const userId = session.user.id;
      console.log('Creating event with authenticated user:', userId);
      console.log('Creating event with data:', newEvent);

      // Determine the correct title based on event type
      let eventTitle = newEvent.title;
      if (newEvent.type === 'Practice') {
        eventTitle = newEvent.isMultiTeam ? 'Multi-Team Practice' : 'Team Practice';
      } else if (newEvent.type === 'Game' && newEvent.opponent) {
        eventTitle = `vs ${newEvent.opponent}`;
      } else if (newEvent.type === 'Tournament') {
        eventTitle = newEvent.title || 'Tournament';
      }

      // Create the main event
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          title: eventTitle,
          date: newEvent.date,
          time: newEvent.time,
          end_time: newEvent.endTime || null,
          location: newEvent.location,
          type: newEvent.type,
          opponent: newEvent.type === 'Game' ? newEvent.opponent || null : null,
          team_count: newEvent.type === 'Tournament' ? newEvent.teamCount || null : null,
          team_id: newEvent.teamId,
          created_by: userId,
          duration: newEvent.type === 'Game' ? newEvent.duration || null : null,
          matchup_format: newEvent.type === 'Game' ? newEvent.matchupFormat || null : null,
          notes: newEvent.notes || null,
          age_groups: newEvent.type === 'Tournament' ? newEvent.ageGroups || null : null,
        })
        .select()
        .single();

      if (eventError) {
        console.error('Error creating event:', eventError);
        throw eventError;
      }

      console.log('Created event:', eventData);

      // Create event_teams entries for multi-team events
      if (newEvent.isMultiTeam && newEvent.selectedTeams && newEvent.selectedTeams.length > 0) {
        // Filter out the primary team to avoid duplicates
        const additionalTeams = newEvent.selectedTeams.filter(teamId => teamId !== newEvent.teamId);
        
        if (additionalTeams.length > 0) {
          const eventTeamEntries = additionalTeams.map(teamId => ({
            event_id: eventData.id,
            team_id: teamId
          }));

          const { error: eventTeamsError } = await supabase
            .from('event_teams')
            .insert(eventTeamEntries);

          if (eventTeamsError) {
            console.error('Error creating event teams:', eventTeamsError);
            // Don't fail the entire operation, just log the error
          } else {
            console.log('Created event_teams entries for additional teams:', additionalTeams);
          }
        }
      }

      // The database trigger will automatically create player RSVPs for all teams
      // including both the primary team and any teams listed in event_teams

      // Send notifications to team members and parents
      try {
        const notificationBody = {
          eventId: eventData.id,
          teamId: newEvent.teamId,
          eventTitle: eventTitle,
          eventDate: newEvent.date,
          eventTime: newEvent.time,
          eventLocation: newEvent.location,
          eventType: newEvent.type,
          duration: newEvent.duration,
          matchupFormat: newEvent.matchupFormat,
          opponent: newEvent.opponent,
          notes: newEvent.notes,
          ageGroups: newEvent.ageGroups,
          selectedTeams: newEvent.selectedTeams,
          isMultiTeam: newEvent.isMultiTeam,
        };

        await supabase.functions.invoke('send-event-notification', {
          body: notificationBody
        });
      } catch (emailError) {
        console.error('Error sending event notifications:', emailError);
        // Don't fail event creation if notification fails
      }

      return eventData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-events'] });
      queryClient.invalidateQueries({ queryKey: ['player-event-rsvps'] });
      toast.success('Event created with player RSVPs!');
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      toast.error('Failed to create event: ' + error.message);
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<NewEventForm> }) => {
      const { data, error } = await supabase
        .from('events')
        .update({
          title: updates.title,
          date: updates.date,
          time: updates.time,
          end_time: updates.endTime || null,
          location: updates.location,
          type: updates.type,
          opponent: updates.type === 'Game' ? updates.opponent || null : null,
          team_count: updates.type === 'Tournament' ? updates.teamCount || null : null,
          duration: updates.type === 'Game' ? updates.duration || null : null,
          matchup_format: updates.type === 'Game' ? updates.matchupFormat || null : null,
          notes: updates.notes || null,
          age_groups: updates.type === 'Tournament' ? updates.ageGroups || null : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-events'] });
      toast.success('Event updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      // First delete player RSVPs
      await supabase
        .from('player_event_rsvps')
        .delete()
        .eq('event_id', eventId);

      // Then delete event_teams entries
      await supabase
        .from('event_teams')
        .delete()
        .eq('event_id', eventId);

      // Finally delete the event
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-events'] });
      queryClient.invalidateQueries({ queryKey: ['player-event-rsvps'] });
      toast.success('Event deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    },
  });

  return {
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
  };
};
