
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRSVPReminders = () => {
  const queryClient = useQueryClient();

  const sendRSVPReminderMutation = useMutation({
    mutationFn: async ({ eventId, reminderType }: { eventId: string; reminderType: 'initial' | '24h' | '2h' }) => {
      console.log('Sending RSVP reminders for event:', eventId, 'type:', reminderType);

      const { data, error } = await supabase.functions.invoke('send-rsvp-reminders', {
        body: {
          eventId,
          reminderType
        }
      });

      if (error) {
        console.error('Error sending RSVP reminders:', error);
        throw error;
      }

      console.log('RSVP reminders sent:', data);
      return data;
    },
    onSuccess: (data) => {
      toast.success(`RSVP reminders sent to ${data?.sentCount || 0} recipients!`);
    },
    onError: (error) => {
      console.error('Error sending RSVP reminders:', error);
      toast.error('Failed to send RSVP reminders');
    },
  });

  const markRemindersAsSentMutation = useMutation({
    mutationFn: async ({ eventId, userIds, playerIds, reminderType }: { 
      eventId: string; 
      userIds?: string[]; 
      playerIds?: string[]; 
      reminderType: string 
    }) => {
      const reminderEntries = [];

      if (userIds) {
        reminderEntries.push(...userIds.map(userId => ({
          event_id: eventId,
          user_id: userId,
          reminder_type: reminderType,
          sent_at: new Date().toISOString()
        })));
      }

      if (playerIds) {
        reminderEntries.push(...playerIds.map(playerId => ({
          event_id: eventId,
          player_id: playerId,
          reminder_type: reminderType,
          sent_at: new Date().toISOString()
        })));
      }

      if (reminderEntries.length === 0) return;

      const { error } = await supabase
        .from('rsvp_reminders')
        .insert(reminderEntries);

      if (error) {
        console.error('Error marking reminders as sent:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rsvp-reminders'] });
    },
  });

  return {
    sendRSVPReminder: sendRSVPReminderMutation.mutate,
    markRemindersAsSent: markRemindersAsSentMutation.mutate,
    isSendingReminder: sendRSVPReminderMutation.isPending,
    isMarkingReminders: markRemindersAsSentMutation.isPending,
  };
};
