import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvitationStore } from "@/stores/invitationStore";
import { InfoIcon } from "lucide-react";
import { toast } from "sonner";

interface InvitePersonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  teamName: string;
  teamType: string;
}

const INVITATION_TYPES = [
  {
    value: "teamManager",
    label: "Team Manager",
    description:
      "Can view team information, schedule, and communicate with the team",
  },
  {
    value: "coach",
    label: "Coach",
    description: "Has coaching privileges and full team management access",
  },
  // {
  //   value: "players",
  //   label: "Player",
  //   description:
  //     "Will be added as a player and can participate in games and practices",
  // },
] as const;

const COACH_ROLES = [
  {
    value: "headCoach",
    label: "Head Coach",
    description: "Has full coaching privileges and team management access",
  },
  {
    value: "assistantCoach",
    label: "Assistant Coach",
    description: "Has coaching privileges and team management access",
  },
  // {
  //   value: "statistician",
  //   label: "Statistician",
  //   description: "Can view team information, schedule, and communicate with the team",
  // },
] as const;

const InvitePersonDialog = ({
  open,
  onOpenChange,
  teamId,
  teamName,
  teamType,
}: InvitePersonDialogProps) => {
  const [email, setEmail] = useState("");
  const [invitationType, setInvitationType] = useState<
    "member" | "coach" | "player"
  >("member");
  const [playerName, setPlayerName] = useState("");
  const [coachRole, setCoachRole] = useState(COACH_ROLES[1]);
  const [inviteeName, setInviteeName] = useState("");

  const { sendInvitation, isLoading, error } = useInvitationStore();

  const selectedInvitationType = INVITATION_TYPES.find(
    (type) => type.value === invitationType
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !inviteeName.trim()) {
      return;
    }
    try {
      await sendInvitation({
        teamId,
        email: email.trim(),
        invitationType,
        coachRole: invitationType === "coach" ? coachRole.value : undefined,
        name: inviteeName.trim(),
      });
      setEmail("");
      setInviteeName("");
      setPlayerName("");
      setInvitationType("member");
      setCoachRole(COACH_ROLES[1]); // Use the actual object instead of string
      onOpenChange(false);
      toast.success("Invitation sent successfully!");
    } catch (error) {
      toast.error("Failed to send invitation. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-blitz-darkgray border-gray-700 text-gray-100 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Invite Coaching Staff</DialogTitle>
          <DialogDescription className='text-gray-400'>
            Send an invitation to join {teamName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1'>
            <Label htmlFor='inviteeName' className='text-white'>
              Name *
            </Label>
            <Input
              id='inviteeName'
              placeholder='Enter name of invited person'
              value={inviteeName}
              onChange={(e) => setInviteeName(e.target.value)}
              required
              className='bg-blitz-darkgray text-white border-gray-700 placeholder:text-gray-400'
            />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='email' className='text-white'>
              Email Address *
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='Enter email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='bg-blitz-darkgray text-white border-gray-700 placeholder:text-gray-400'
            />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='type' className='text-white'>
              Invitation Type
            </Label>
            <Select
              value={invitationType}
              onValueChange={(value) =>
                setInvitationType(value as typeof invitationType)
              }
            >
              <SelectTrigger className='bg-blitz-darkgray text-white border-gray-700'>
                <SelectValue placeholder='Select invitation type' />
              </SelectTrigger>
              <SelectContent className='bg-blitz-darkgray text-white border-gray-700'>
                {INVITATION_TYPES.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className='text-white hover:bg-blitz-gray'
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedInvitationType && (
              <div className='p-2 bg-blitz-charcoal rounded border border-gray-600 flex items-start gap-2'>
                <InfoIcon className='h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0' />
                <p className='text-xs text-gray-300'>
                  {selectedInvitationType.description}
                </p>
              </div>
            )}
          </div>

          {/* {invitationType === "player" && (
            <div className="space-y-1">
              <Label htmlFor="playerName" className="text-white">
                Player Name *
              </Label>
              <Input
                id="playerName"
                placeholder="Enter player name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
                className="bg-blitz-darkgray text-white border-gray-700 placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400">
                The person will be invited as a player and can participate in
                games and practices.
              </p>
            </div>
          )} */}

          {invitationType === "coach" && (
            <div className='space-y-1'>
              <Label htmlFor='role' className='text-white'>
                Coach Role
              </Label>
              <Select
                value={coachRole.value}
                onValueChange={(value) => {
                  const role = COACH_ROLES.find((r) => r.value === value);
                  if (role) {
                    setCoachRole(role);
                  }
                }}
              >
                <SelectTrigger className='bg-blitz-darkgray text-white border-gray-700'>
                  <SelectValue placeholder='Select a role' />
                </SelectTrigger>
                <SelectContent className='bg-blitz-darkgray text-white border-gray-700'>
                  {COACH_ROLES.map((role) => (
                    <SelectItem
                      key={role.label}
                      value={role.value}
                      className='text-white hover:bg-blitz-gray'
                    >
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className='text-xs text-gray-400'>
                The person will have coaching privileges and full team
                management access.
              </p>
            </div>
          )}

          {invitationType === "member" && (
            <div className='p-2 bg-blitz-charcoal rounded border border-gray-600'>
              <p className='text-xs text-gray-300'>
                <strong>Team Member Access:</strong> The person will be able to
                view team information, schedule, and communicate with the team.
                This is typically used for parents and guardians.
              </p>
            </div>
          )}

          <DialogFooter className='pt-4'>
            <Button
              type='submit'
              disabled={
                isLoading ||
                !email.trim() ||
                !inviteeName.trim() ||
                (invitationType === "player" && !playerName.trim())
              }
              className='w-full bg-blitz-purple hover:bg-blitz-purple/90 text-white'
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                  <span>Sending Invitation...</span>
                </div>
              ) : (
                "Send Invitation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePersonDialog;
