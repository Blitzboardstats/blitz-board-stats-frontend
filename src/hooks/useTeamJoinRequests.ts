
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { toast } from 'sonner';

interface TeamJoinRequest {
  id: string;
  team_id: string;
  guardian_user_id: string;
  guardian_email: string;
  player_name: string;
  player_jersey_number?: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
  team?: {
    name: string;
    football_type: string;
    age_group?: string;
  };
}

export const useTeamJoinRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<TeamJoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGuardianRequests = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_join_requests')
        .select(`
          *,
          team:teams(name, football_type, age_group)
        `)
        .eq('guardian_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to ensure status field is properly typed
      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected'
      }));
      
      setRequests(typedData);
    } catch (error) {
      console.error('Error fetching guardian requests:', error);
      toast.error('Failed to load your team requests');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCoachRequests = async (teamId?: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      let query = supabase
        .from('team_join_requests')
        .select(`
          *,
          team:teams(name, football_type, age_group)
        `)
        .eq('status', 'pending');

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to ensure status field is properly typed
      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected'
      }));
      
      setRequests(typedData);
    } catch (error) {
      console.error('Error fetching coach requests:', error);
      toast.error('Failed to load team requests');
    } finally {
      setIsLoading(false);
    }
  };

  const submitJoinRequest = async (teamId: string, playerName: string, playerJerseyNumber?: string, message?: string) => {
    if (!user) {
      toast.error('You must be logged in to submit a request');
      return false;
    }

    try {
      const { error } = await supabase
        .from('team_join_requests')
        .insert({
          team_id: teamId,
          guardian_user_id: user.id,
          guardian_email: user.email || '',
          player_name: playerName,
          player_jersey_number: playerJerseyNumber,
          message: message
        });

      if (error) throw error;

      toast.success('Team join request submitted successfully!');
      fetchGuardianRequests(); // Refresh the list
      return true;
    } catch (error: any) {
      console.error('Error submitting join request:', error);
      toast.error('Failed to submit request');
      return false;
    }
  };

  const approveRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('team_join_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Request approved successfully!');
      return true;
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
      return false;
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('team_join_requests')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Request rejected');
      return true;
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchGuardianRequests();
    }
  }, [user]);

  return {
    requests,
    isLoading,
    fetchGuardianRequests,
    fetchCoachRequests,
    submitJoinRequest,
    approveRequest,
    rejectRequest
  };
};
