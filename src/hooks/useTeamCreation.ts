
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Team } from '@/types/teamTypes';

export const useTeamCreation = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createTeam = async (newTeam: Team, userId: string): Promise<boolean> => {
    if (!userId) {
      toast.error("You must be logged in to create a team");
      return false;
    }

    setIsCreating(true);
    try {
      // Upload team photo if provided
      let photoUrl = null;
      if (newTeam.photo_url && typeof newTeam.photo_url === 'string' && newTeam.photo_url.startsWith('data:')) {
        const file = await dataURLtoFile(newTeam.photo_url, `team-${Date.now()}.jpg`);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('team_photos')
          .upload(`team-${Date.now()}`, file);
        
        if (uploadError) throw uploadError;
        
        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('team_photos')
          .getPublicUrl(uploadData.path);
          
        photoUrl = urlData.publicUrl;
      }
      
      // Create team in Supabase with created_by field
      const { data, error } = await supabase
        .from('teams')
        .insert([{
          name: newTeam.name,
          football_type: newTeam.football_type,
          age_group: newTeam.age_group || null,
          season: newTeam.season || null,
          photo_url: photoUrl,
          coach_id: userId,
          created_by: userId
        }])
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        toast.success(`Team "${newTeam.name}" created successfully`);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error creating team:", error.message);
      toast.error("Failed to create team");
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  // Helper function to convert data URL to file
  const dataURLtoFile = async (dataURL: string, filename: string) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return {
    createTeam,
    isCreating
  };
};
