
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { useUserTeams } from '@/hooks/useUserTeams';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NewPostProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSavePost: (title: string, content: string, allowComments: boolean, authorName: string, teamId?: string) => void;
}

const NewPost = ({ open, onOpenChange, onSavePost }: NewPostProps) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const { user, isCoach } = useAuth();
  const { teams } = useUserTeams();

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setTitle("");
        setContent("");
        setSelectedTeams([]);
      }, 200);
    }
  }, [open]);

  const handleTeamToggle = (teamId: string, checked: boolean) => {
    if (checked) {
      setSelectedTeams(prev => [...prev, teamId]);
    } else {
      setSelectedTeams(prev => prev.filter(id => id !== teamId));
    }
  };

  const sendEmailsToGuardians = async () => {
    if (selectedTeams.length === 0) return;

    try {
      // Get all players from selected teams
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('guardian_email, guardian_name, team_id')
        .in('team_id', selectedTeams)
        .not('guardian_email', 'is', null);

      if (playersError) throw playersError;

      // Filter out duplicates and invalid emails
      const uniqueEmails = Array.from(
        new Set(
          players
            ?.filter(player => player.guardian_email && player.guardian_email.includes('@'))
            .map(player => player.guardian_email)
        )
      );

      if (uniqueEmails.length === 0) {
        toast.error("No guardian emails found for selected teams");
        return;
      }

      // Get team names for signature
      const selectedTeamNames = teams
        .filter(team => selectedTeams.includes(team.id))
        .map(team => team.name);

      // Get coach name (use display name from user metadata or email)
      const coachName = user?.name || user?.email?.split('@')[0] || 'Coach';

      // Send email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-team-email', {
        body: {
          to: uniqueEmails,
          subject: title,
          text: content,
          teamNames: selectedTeamNames,
          coachName: coachName
        }
      });

      if (emailError) throw emailError;

      toast.success(`Announcement emailed to ${uniqueEmails.length} guardians`);
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error("Failed to send emails to guardians");
    }
  };

  const handleSave = () => {
    if (!user?.email) {
      toast.error("User email not found");
      return;
    }

    if (selectedTeams.length === 0) {
      toast.error("Please select at least one team");
      return;
    }

    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const handleConfirmPost = async () => {
    if (!user?.email) return;

    // Create the announcement first
    onSavePost(title, content, true, user.email, selectedTeams[0]);
    
    // Send emails to guardians if user is a coach
    if (isCoach) {
      await sendEmailsToGuardians();
    }
    
    // Close dialogs
    setShowConfirmation(false);
    onOpenChange(false);
  };

  const getSelectedTeamNames = () => {
    return teams
      .filter(team => selectedTeams.includes(team.id))
      .map(team => team.name)
      .join(', ');
  };

  // Filter teams based on user's role - coaches can only post to teams they coach
  const availableTeams = isCoach 
    ? teams.filter(team => team.userRole === 'coach' || team.userRole === 'creator')
    : teams;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-blitz-charcoal text-white border-gray-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">New Announcement</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Announcement Title"
                className="mt-1 input-field"
              />
            </div>

            <div>
              <Label htmlFor="content">Message</Label>
              <Textarea 
                id="content"
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Type your message here..."
                className="mt-1 input-field min-h-[150px]"
              />
            </div>
            
            {availableTeams.length > 0 && (
              <div>
                <Label htmlFor="teams">Select Teams</Label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-gray-700 rounded-md p-3">
                  {availableTeams.map((team) => (
                    <div key={team.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`team-${team.id}`}
                        checked={selectedTeams.includes(team.id)}
                        onCheckedChange={(checked) => handleTeamToggle(team.id, checked as boolean)}
                      />
                      <Label htmlFor={`team-${team.id}`} className="text-sm cursor-pointer">
                        {team.name} 
                        <span className="text-xs text-gray-400 ml-1">({team.userRole})</span>
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedTeams.length === 0 
                    ? "Select teams to post announcement to" 
                    : `Announcement will be sent to ${selectedTeams.length} team(s)`}
                </p>
              </div>
            )}

            {availableTeams.length === 0 && (
              <div className="text-center text-gray-400 py-4">
                <p>You need to join or create a team to post announcements.</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button 
                onClick={handleSave} 
                disabled={!title.trim() || !content.trim() || selectedTeams.length === 0}
                className="bg-blitz-purple hover:bg-blitz-purple/90"
              >
                Post Announcement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="bg-blitz-charcoal text-white border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Announcement</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to post this announcement{isCoach ? ' and send it via email to all guardians of the selected teams' : ''}?
              <br /><br />
              <strong>Teams:</strong> {getSelectedTeamNames()}
              <br />
              <strong>Title:</strong> {title}
              {isCoach && (
                <>
                  <br /><br />
                  <em>Note: Guardian emails will be sent privately (BCC) to protect privacy, and replies will be sent directly to you.</em>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-600 hover:bg-gray-700 text-white border-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmPost}
              className="bg-blitz-purple hover:bg-blitz-purple/90"
            >
              {isCoach ? 'Post & Send Emails' : 'Post Announcement'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NewPost;
