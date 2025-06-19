
import { useState } from 'react';
import { useInvitationEmail } from './useInvitationEmail';
import { useTeamInvitationsOptimized } from './useTeamInvitationsOptimized';
import { toast } from 'sonner';

interface CreateInvitationData {
  email: string;
  invitationType: 'member' | 'coach' | 'player';
  playerName?: string;
  coachRole?: string;
}

export const useInvitationCreation = (teamId: string, teamName: string, teamType: string) => {
  const [isCreating, setIsCreating] = useState(false);
  const { sendInvitationEmail } = useInvitationEmail();
  const { fetchUserInvitations } = useTeamInvitationsOptimized();

  const createAndSendInvitation = async (data: CreateInvitationData) => {
    setIsCreating(true);
    
    try {
      console.log('Creating and sending invitation for:', data.email, 'type:', data.invitationType);
      
      // Send the invitation email (edge function now handles database creation)
      const emailSuccess = await sendInvitationEmail(
        teamId,
        data.email,
        data.invitationType,
        teamName,
        teamType,
        data.playerName,
        data.coachRole
      );

      if (emailSuccess) {
        toast.success(`Invitation sent successfully to ${data.email}`);
        // Refresh invitations list to show the new invitation
        await fetchUserInvitations();
        return true;
      } else {
        toast.error('Failed to send invitation');
        return false;
      }
    } catch (error: any) {
      console.error('Error creating invitation - Full details:', error);
      
      // Extract specific error information
      const errorCode = error?.code || error?.response?.code || 'UNKNOWN_ERROR';
      const errorMessage = error?.message || error?.response?.message || 'Unknown error occurred';
      const errorDetails = error?.details || error?.response?.details || 'No additional details available';
      
      // Show detailed error information in console
      const detailedError = `Error Code: ${errorCode}\nMessage: ${errorMessage}\nDetails: ${errorDetails}`;
      console.error('Detailed error information:', detailedError);
      
      // Show user-friendly error with technical details
      let userMessage = `Failed to create invitation. ${errorMessage}`;
      if (errorCode !== 'UNKNOWN_ERROR') {
        userMessage += ` (Code: ${errorCode})`;
      }
      
      // Add specific guidance for common errors
      if (errorCode === 'AUTH_REQUIRED') {
        userMessage = 'Authentication required. Please log in and try again.';
      } else if (errorCode === 'DB_INSERT_ERROR') {
        userMessage = 'Database error. You may not have permission to invite users to this team.';
      } else if (errorCode === 'EMAIL_CONFIG_ERROR') {
        userMessage = 'Email service configuration error. Please contact support.';
      } else if (errorCode === 'MAILGUN_ERROR') {
        userMessage = 'Email delivery failed. Please check the email address and try again.';
      }
      
      toast.error(userMessage);
      
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createAndSendInvitation,
    isCreating
  };
};
