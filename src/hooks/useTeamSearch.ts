
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Team {
  id: string;
  name: string;
  football_type: string;
  age_group?: string;
  season?: string;
  coach_id: string;
  created_by: string;
  photo_url?: string;
  created_at: string;
}

export const useTeamSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.trim()) {
      searchTeams();
    } else {
      setTeams([]);
    }
  }, [searchTerm]);

  const searchTeams = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(20);

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error searching teams:', error);
      toast.error('Failed to search teams');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    teams,
    isLoading
  };
};
