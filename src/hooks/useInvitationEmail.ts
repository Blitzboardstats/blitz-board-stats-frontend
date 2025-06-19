
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { toast } from 'sonner';

export const useInvitationEmail = () => {
  const { user } = useAuth();

  const sendInvitationEmail = async (
    teamId: string,
    email: string,
    invitationType: 'member' | 'coach' | 'player',
    teamName: string,
    teamType: string,
    playerName?: string,
    coachRole?: string
  ) => {
    try {
      const inviterName = user?.name || user?.email?.split('@')[0] || 'Team Administrator';

      console.log('Calling send-invitation-email edge function with:', {
        to: email,
        teamName,
        teamType,
        inviterName,
        invitationType,
        teamId,
        playerName,
        coachRole
      });

      const { data, error } = await supabase.functions.invoke('send-invitation-email', {
        body: {
          to: email,
          teamName,
          teamType,
          inviterName,
          invitationType,
          teamId,
          playerName,
          coachRole
        }
      });

      if (error) {
        console.error('Edge function error - Full details:', error);
        const errorCode = error?.message?.includes('400') ? 'BAD_REQUEST' : 
                         error?.message?.includes('401') ? 'UNAUTHORIZED' : 
                         error?.message?.includes('500') ? 'SERVER_ERROR' : 'UNKNOWN_ERROR';
        
        console.error(`Edge function error - Code: ${errorCode}, Message: ${error.message}`);
        throw new Error(`Email service error: ${error.message} (Code: ${errorCode})`);
      }

      console.log('Email sent successfully:', data);
      return true;
    } catch (error: any) {
      console.error('Error sending invitation email - Full details:', error);
      
      const errorCode = error?.code || 'EMAIL_ERROR';
      const errorMessage = error?.message || 'Failed to send invitation email';
      
      console.error(`Send email error - Code: ${errorCode}, Message: ${errorMessage}`);
      toast.error(`Email sending failed: ${errorMessage} (Code: ${errorCode})`);
      return false;
    }
  };

  return { sendInvitationEmail };
};
