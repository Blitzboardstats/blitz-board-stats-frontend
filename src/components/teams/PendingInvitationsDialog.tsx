import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Mail,
  Users,
  Trophy,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { TeamInvitation } from "@/types/invitationTypes";
import { useAuth } from "@/contexts/AuthContextOptimized";

interface PendingInvitationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitations: TeamInvitation[];
  onAccept: (invitationId: string) => Promise<boolean>;
  onDecline: (invitationId: string) => Promise<boolean>;
  isLoading: boolean;
}

const PendingInvitationsDialog = ({
  open,
  onOpenChange,
  invitations,
  onAccept,
  onDecline,
  isLoading,
}: PendingInvitationsDialogProps) => {
  const { user } = useAuth();

  const getInvitationTypeIcon = (type: string) => {
    switch (type) {
      case "coach":
        return <Users className="h-4 w-4" />;
      case "player":
        return <Trophy className="h-4 w-4" />;
      default:
        return <UserCheck className="h-4 w-4" />;
    }
  };

  const getInvitationTypeColor = (type: string) => {
    switch (type) {
      case "coach":
        return "bg-blue-600";
      case "player":
        return "bg-green-600";
      default:
        return "bg-purple-600";
    }
  };

  const getRoleAccessDescription = (invitation: TeamInvitation) => {
    switch (invitation.invitation_type) {
      case "player":
        return "You'll be added as a player to this team and can participate in games and practices.";
      case "coach":
        return `You'll have coaching privileges as ${
          invitation.coach_role || "Assistant Coach"
        } and full team management access.`;
      case "member":
      default:
        return "You'll have access to view team information, schedule, and communicate with the team.";
    }
  };

  const getRoleCompatibilityWarning = (invitation: TeamInvitation) => {
    if (user?.role === "player" && invitation.invitation_type !== "player") {
      return {
        show: true,
        message:
          "This invitation is not for a player role. You may not be able to accept it.",
        type: "warning" as const,
      };
    }

    if (user?.role === "coach" && invitation.invitation_type === "player") {
      return {
        show: true,
        message:
          "This is a player invitation, but you're registered as a coach.",
        type: "info" as const,
      };
    }

    return { show: false, message: "", type: "info" as const };
  };

  const formatInvitationType = (invitation: TeamInvitation) => {
    if (invitation.invitation_type === "coach") {
      return `Coach - ${invitation.coach_role || "Assistant Coach"}`;
    } else if (invitation.invitation_type === "player") {
      return `Player - ${invitation.player_name}`;
    }
    return "Team Member";
  };

  const handleAccept = async (invitationId: string) => {
    const success = await onAccept(invitationId);
    if (success && invitations.length === 1) {
      onOpenChange(false);
    }
  };

  const handleDecline = async (invitationId: string) => {
    const success = await onDecline(invitationId);
    if (success && invitations.length === 1) {
      onOpenChange(false);
    }
  };

  if (invitations.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-blitz-darkgray border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-blitz-purple" />
            Pending Team Invitations
            <Badge className="bg-blitz-purple/20 text-blitz-purple">
              {invitations.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            You have {invitations.length} pending team invitation
            {invitations.length > 1 ? "s" : ""}. Review and accept or decline
            each invitation below.
          </p>

          {invitations.map((invitation) => {
            const compatibility = getRoleCompatibilityWarning(invitation);

            return (
              <Card
                key={invitation.id}
                className="bg-blitz-charcoal border-gray-600"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white">
                        {invitation.team?.name}
                      </span>
                      <Badge
                        className={`text-white ${getInvitationTypeColor(
                          invitation.invitation_type
                        )}`}
                      >
                        {getInvitationTypeIcon(invitation.invitation_type)}
                        <span className="ml-1">
                          {invitation.invitation_type}
                        </span>
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Role:</span>
                      <p className="text-white font-medium">
                        {formatInvitationType(invitation)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Team Type:</span>
                      <p className="text-white">
                        {invitation.team?.football_type}
                      </p>
                    </div>
                    {invitation.team?.age_group && (
                      <div>
                        <span className="text-gray-400">Age Group:</span>
                        <p className="text-white">
                          {invitation.team.age_group}
                        </p>
                      </div>
                    )}
                    {invitation.team?.season && (
                      <div>
                        <span className="text-gray-400">Season:</span>
                        <p className="text-white">{invitation.team.season}</p>
                      </div>
                    )}
                  </div>

                  {/* Role-specific access description */}
                  <div className="p-3 bg-blitz-darkgray rounded border border-gray-600">
                    <p className="text-sm text-gray-300">
                      <strong className="text-blitz-purple">
                        What you'll get:
                      </strong>{" "}
                      {getRoleAccessDescription(invitation)}
                    </p>
                  </div>

                  {/* Role compatibility warning */}
                  {compatibility.show && (
                    <div
                      className={`p-3 rounded border flex items-start gap-2 ${
                        compatibility.type === "warning"
                          ? "bg-yellow-900/20 border-yellow-800 text-yellow-300"
                          : "bg-blue-900/20 border-blue-800 text-blue-300"
                      }`}
                    >
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{compatibility.message}</p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Invited:{" "}
                    {new Date(invitation.created_at).toLocaleDateString()} at{" "}
                    {new Date(invitation.created_at).toLocaleTimeString()}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => handleAccept(invitation._id)}
                      disabled={isLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleDecline(invitation._id)}
                      disabled={isLoading}
                      variant="outline"
                      className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PendingInvitationsDialog;
