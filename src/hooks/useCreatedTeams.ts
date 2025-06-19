
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Team } from '@/types/teamTypes';

export const useCreatedTeams = () => {
  const [createdTeams, setCreatedTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCreatedTeams = useCallback(async (userId: string) => {
    console.log("Fetching created teams for user:", userId);
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *, 
          players(*)
        `)
        .eq('created_by', userId);
      
      if (error) throw error;
      
      console.log("Created teams fetched successfully:", data?.length || 0);
      
      // Type assertion to ensure football_type is properly typed
      const typedTeams = (data || []).map(team => ({
        ...team,
        football_type: team.football_type as 'Tackle' | 'Flag'
      })) as Team[];
      
      setCreatedTeams(typedTeams);
      return typedTeams;
    } catch (err: any) {
      console.error("Error fetching created teams:", err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createdTeams,
    isLoading,
    error,
    fetchCreatedTeams
  };
};
