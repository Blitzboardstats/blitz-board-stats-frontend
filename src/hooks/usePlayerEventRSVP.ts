
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PlayerEventRSVP {
  id: string;
  event_id: string;
  player_id: string;
  response: 'yes' | 'no' | 'maybe' | 'pending';
  notes?: string;
  player_name: string;
  jersey_number?: string;
  team_name: string;
  team_id: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceStats {
  total: number;
  attending: number;
  maybe: number;
  notAttending: number;
  pending: number;
  byTeam: Record<string, {
    attending: number;
    maybe: number;
    notAttending: number;
    pending: number;
    total: number;
  }>;
}

export const usePlayerEventRSVP = (eventId: string) => {
  const queryClient = useQueryClient();

  // Fetch player RSVPs with enhanced team information for multi-team events
  const { data: playerRSVPs = [], isLoading, error } = useQuery({
    queryKey: ['player-event-rsvps', eventId],
    queryFn: async () => {
      console.log('Fetching player RSVPs for event:', eventId);
      
      const { data, error } = await supabase
        .from('player_event_rsvps')
        .select(`
          id,
          event_id,
          player_id,
          response,
          notes,
          created_at,
          updated_at,
          players!inner (
            id,
            name,
            jersey_number,
            team_id,
            teams!inner (
              id,
              name
            )
          )
        `)
        .eq('event_id', eventId);

      if (error) {
        console.error('Error fetching player RSVPs:', error);
        throw error;
      }

      console.log('Fetched player RSVPs data:', data);

      // Transform the data to match our interface
      const transformedData: PlayerEventRSVP[] = data.map((rsvp: any) => ({
        id: rsvp.id,
        event_id: rsvp.event_id,
        player_id: rsvp.player_id,
        response: rsvp.response,
        notes: rsvp.notes,
        player_name: rsvp.players.name,
        jersey_number: rsvp.players.jersey_number,
        team_name: rsvp.players.teams.name,
        team_id: rsvp.players.team_id,
        created_at: rsvp.created_at,
        updated_at: rsvp.updated_at,
      }));

      // Sort in JavaScript: first by team name, then by player name
      const sortedData = transformedData.sort((a, b) => {
        // First sort by team name
        const teamComparison = a.team_name.localeCompare(b.team_name);
        if (teamComparison !== 0) {
          return teamComparison;
        }
        // Then sort by player name within the same team
        return a.player_name.localeCompare(b.player_name);
      });

      console.log('Transformed and sorted player RSVPs:', sortedData);
      return sortedData;
    },
    enabled: !!eventId,
  });

  // Calculate attendance statistics
  const attendanceStats: AttendanceStats = {
    total: playerRSVPs.length,
    attending: playerRSVPs.filter(rsvp => rsvp.response === 'yes').length,
    maybe: playerRSVPs.filter(rsvp => rsvp.response === 'maybe').length,
    notAttending: playerRSVPs.filter(rsvp => rsvp.response === 'no').length,
    pending: playerRSVPs.filter(rsvp => rsvp.response === 'pending').length,
    byTeam: {},
  };

  // Calculate stats by team for multi-team events
  const teamStats: Record<string, any> = {};
  playerRSVPs.forEach(rsvp => {
    if (!teamStats[rsvp.team_name]) {
      teamStats[rsvp.team_name] = {
        attending: 0,
        maybe: 0,
        notAttending: 0,
        pending: 0,
        total: 0,
      };
    }
    
    teamStats[rsvp.team_name].total++;
    
    switch (rsvp.response) {
      case 'yes':
        teamStats[rsvp.team_name].attending++;
        break;
      case 'maybe':
        teamStats[rsvp.team_name].maybe++;
        break;
      case 'no':
        teamStats[rsvp.team_name].notAttending++;
        break;
      case 'pending':
        teamStats[rsvp.team_name].pending++;
        break;
    }
  });

  attendanceStats.byTeam = teamStats;

  // Update player RSVP mutation
  const updatePlayerRSVPMutation = useMutation({
    mutationFn: async ({ playerId, response, notes }: { 
      playerId: string; 
      response: 'yes' | 'no' | 'maybe' | 'pending';
      notes?: string;
    }) => {
      console.log('Updating player RSVP:', { playerId, response, notes });
      
      const { data, error } = await supabase
        .from('player_event_rsvps')
        .update({ 
          response,
          notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('event_id', eventId)
        .eq('player_id', playerId)
        .select()
        .single();

      if (error) {
        console.error('Error updating player RSVP:', error);
        throw error;
      }

      console.log('Updated player RSVP:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-event-rsvps', eventId] });
      toast.success('RSVP updated successfully');
    },
    onError: (error) => {
      console.error('Error updating RSVP:', error);
      toast.error('Failed to update RSVP');
    },
  });

  // Bulk update player RSVPs mutation
  const bulkUpdatePlayerRSVPMutation = useMutation({
    mutationFn: async ({ playerIds, response }: { 
      playerIds: string[]; 
      response: 'yes' | 'no' | 'maybe' | 'pending';
    }) => {
      console.log('Bulk updating player RSVPs:', { playerIds, response });
      
      const { data, error } = await supabase
        .from('player_event_rsvps')
        .update({ 
          response,
          updated_at: new Date().toISOString()
        })
        .eq('event_id', eventId)
        .in('player_id', playerIds)
        .select();

      if (error) {
        console.error('Error bulk updating player RSVPs:', error);
        throw error;
      }

      console.log('Bulk updated player RSVPs:', data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['player-event-rsvps', eventId] });
      toast.success(`Updated ${variables.playerIds.length} player RSVPs`);
    },
    onError: (error) => {
      console.error('Error bulk updating RSVPs:', error);
      toast.error('Failed to update RSVPs');
    },
  });

  return {
    playerRSVPs,
    attendanceStats,
    isLoading,
    error,
    updatePlayerRSVP: updatePlayerRSVPMutation.mutate,
    bulkUpdatePlayerRSVP: bulkUpdatePlayerRSVPMutation.mutate,
    isUpdating: updatePlayerRSVPMutation.isPending || bulkUpdatePlayerRSVPMutation.isPending,
  };
};
