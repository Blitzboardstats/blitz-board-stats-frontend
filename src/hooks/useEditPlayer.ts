
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContextOptimized';
import { Player } from '@/types/playerTypes';

const playerSchema = z.object({
  name: z.string().min(2, "Player name is required"),
  position: z.string().optional(),
  jersey_number: z.string().optional(),
  guardian_name: z.string().optional(),
  guardian_email: z.string().email("Invalid email").optional().or(z.literal('')),
  graduation_year: z.string().optional(),
  recruit_profile: z.string().optional(),
});

export const useEditPlayer = (
  player: Player | null,
  onEditPlayer: (playerId: string, updatedPlayer: Partial<Player>) => Promise<boolean>,
  onOpenChange: (open: boolean) => void
) => {
  const { user } = useAuth();
  const [playerPhoto, setPlayerPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalGuardianEmail, setOriginalGuardianEmail] = useState<string>('');
  
  const form = useForm<z.infer<typeof playerSchema>>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: "",
      position: "",
      jersey_number: "",
      guardian_name: "",
      guardian_email: "",
      graduation_year: "",
      recruit_profile: "",
    },
  });
  
  // Reset form and set default values when player changes
  useEffect(() => {
    if (player) {
      form.reset({
        name: player.name || "",
        position: player.position || "",
        jersey_number: player.jersey_number || "",
        guardian_name: player.guardian_name || "",
        guardian_email: player.guardian_email || "",
        graduation_year: player.graduation_year ? player.graduation_year.toString() : "",
        recruit_profile: player.recruit_profile || "",
      });
      
      setPlayerPhoto(player.photo_url || null);
      setOriginalGuardianEmail(player.guardian_email || '');
    }
  }, [player, form]);
  
  const sendGuardianWelcomeEmail = async (guardianEmail: string, guardianName: string, playerName: string, teamName: string, ageGroup?: string, footballType?: string) => {
    try {
      const coachName = user?.name || user?.email?.split('@')[0] || 'Coach';
      
      await supabase.functions.invoke('send-guardian-welcome', {
        body: {
          guardianName: guardianName || '',
          guardianEmail: guardianEmail,
          playerName: playerName,
          teamName: teamName,
          coachName: coachName,
          ageGroup: ageGroup,
          footballType: footballType
        }
      });
      
      console.log("Guardian welcome email sent successfully to:", guardianEmail);
      toast.success(`Welcome email sent to ${guardianEmail}`);
    } catch (emailError) {
      console.error("Error sending guardian welcome email:", emailError);
      toast.error("Failed to send welcome email to guardian");
    }
  };
  
  const handleSubmit = async (values: z.infer<typeof playerSchema>) => {
    if (!player) return;
    
    setIsSubmitting(true);
    
    const updatedPlayer: Partial<Player> = {
      name: values.name,
      position: values.position || '',
      jersey_number: values.jersey_number || '',
      guardian_name: values.guardian_name || '',
      guardian_email: values.guardian_email || '',
      graduation_year: values.graduation_year ? parseInt(values.graduation_year) : undefined,
      recruit_profile: values.recruit_profile || '',
      photo_url: playerPhoto || undefined,
    };
    
    try {
      const success = await onEditPlayer(player.id, updatedPlayer);
      if (success) {
        // Check if guardian email was changed and is not empty
        const newGuardianEmail = values.guardian_email?.trim();
        const emailChanged = newGuardianEmail && 
                           newGuardianEmail !== originalGuardianEmail && 
                           newGuardianEmail.length > 0;
        
        if (emailChanged) {
          // Get team information for the welcome email
          const { data: teamData, error: teamError } = await supabase
            .from('teams')
            .select('name, age_group, football_type')
            .eq('id', player.team_id)
            .single();
          
          if (teamError) {
            console.error("Error fetching team data for email:", teamError);
          } else if (teamData) {
            // Send welcome email to the new guardian email
            await sendGuardianWelcomeEmail(
              newGuardianEmail,
              values.guardian_name || '',
              values.name,
              teamData.name,
              teamData.age_group,
              teamData.football_type
            );
          }
        }
        
        toast.success(`${values.name} has been updated`);
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Failed to update player");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    playerPhoto,
    setPlayerPhoto,
    isSubmitting,
    originalGuardianEmail,
    handleSubmit,
    playerSchema
  };
};
