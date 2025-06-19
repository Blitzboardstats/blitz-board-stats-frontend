
import React from 'react';
import { Button } from '@/components/ui/button';
import InvitationNotificationBanner from './InvitationNotificationBanner';

interface InvitationBannerProps {
  invitations: any[];
  showBanner: boolean;
  onViewInvitations: () => void;
  onDismiss: () => void;
  isLoading: boolean;
  error: string | null;
}

const InvitationBanner = ({ 
  invitations, 
  showBanner, 
  onViewInvitations, 
  onDismiss,
  isLoading,
  error 
}: InvitationBannerProps) => {
  // Only show error if there's an actual error (not empty results)
  if (error) {
    return (
      <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
        <p className="text-red-300 text-sm">
          {error}
        </p>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="mb-4 p-3 bg-gray-800 border border-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blitz-purple"></div>
          <span className="text-gray-400 text-sm">Checking for invitations...</span>
        </div>
      </div>
    );
  }

  // Don't show anything if no invitations (this is normal)
  if (invitations.length === 0) {
    return null;
  }

  // Show invitation banner and button if there are invitations
  return (
    <>
      {showBanner && (
        <InvitationNotificationBanner
          invitations={invitations}
          onViewInvitations={onViewInvitations}
          onDismiss={onDismiss}
        />
      )}

      <div className="mb-4">
        <Button
          onClick={onViewInvitations}
          className="w-full bg-blitz-green hover:bg-blitz-green/90"
        >
          View {invitations.length} Pending Invitation{invitations.length > 1 ? 's' : ''}
        </Button>
      </div>
    </>
  );
};

export default InvitationBanner;
