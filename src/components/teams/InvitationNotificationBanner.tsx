
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, X } from 'lucide-react';
import { TeamInvitation } from '@/types/invitationTypes';

interface InvitationNotificationBannerProps {
  invitations: TeamInvitation[];
  onViewInvitations: () => void;
  onDismiss: () => void;
}

const InvitationNotificationBanner = ({
  invitations,
  onViewInvitations,
  onDismiss
}: InvitationNotificationBannerProps) => {
  if (invitations.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blitz-purple/20 to-blitz-green/20 border border-blitz-purple/30 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-blitz-purple" />
          <div>
            <h3 className="font-semibold text-white">
              You have pending team invitations
            </h3>
            <p className="text-sm text-gray-300">
              {invitations.length} invitation{invitations.length > 1 ? 's' : ''} waiting for your response
            </p>
          </div>
          <Badge className="bg-blitz-purple/20 text-blitz-purple">
            {invitations.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onViewInvitations}
            className="bg-blitz-purple hover:bg-blitz-purple/90"
          >
            View Invitations
          </Button>
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvitationNotificationBanner;
