
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import TeamCard from '@/components/teams/TeamCard';
import CreateTeamDialog from '@/components/teams/CreateTeamDialog';
import LeaveTeamDialog from '@/components/teams/LeaveTeamDialog';
import PendingInvitationsDialog from '@/components/teams/PendingInvitationsDialog';
import InvitationNotificationBanner from '@/components/teams/InvitationNotificationBanner';
import { Team } from '@/types/teamTypes';
import { supabase } from "@/integrations/supabase/client";
import { useTeamInvitationsOptimized } from '@/hooks/useTeamInvitationsOptimized';

// Extend Team type to include isCreator property
type TeamWithCreatorInfo = Team & { 
  isCreator: boolean;
  playerCount: number;
};

const TeamManagement = () => {
  const [allUserTeams, setAllUserTeams] = useState<TeamWithCreatorInfo[]>([]);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [selectedTeamToLeave, setSelectedTeamToLeave] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvitationsDialogOpen, setIsInvitationsDialogOpen] = useState(false);
  const [showInvitationBanner, setShowInvitationBanner] = useState(true);
  const { user, isCoach } = useAuth();
  const navigate = useNavigate();
  
  const { 
    invitations, 
    isLoading: invitationsLoading, 
    acceptInvitation, 
    declineInvitation 
  } = useTeamInvitationsOptimized();
  
  useEffect(() => {
    if (user) {
      fetchAllUserTeams();
    }
  }, [user]);
  
  const fetchAllUserTeams = async () => {
    setIsLoading(true);
    try {
      if (!user?.id) {
        toast.error("You must be logged in to view teams");
        navigate('/login');
        return;
      }

      console.log("Fetching all teams for user:", user.id);
      
      // Get teams where user is the creator/coach
      const { data: createdTeams, error: createdError } = await supabase
        .from('teams')
        .select(`
          *, 
          players(*)
        `)
        .eq('created_by', user.id);
      
      if (createdError) {
        console.error("Error fetching created teams:", createdError);
        throw createdError;
      }

      console.log("Created teams:", createdTeams);
      
      // Get teams where user is a member
      const { data: membershipData, error: membershipError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);
      
      if (membershipError) {
        console.error("Error fetching team memberships:", membershipError);
        throw membershipError;
      }

      console.log("Team memberships:", membershipData);
      
      let joinedTeams: any[] = [];
      if (membershipData && membershipData.length > 0) {
        const teamIds = membershipData.map(m => m.team_id);
        
        const { data: joinedTeamsData, error: joinedError } = await supabase
          .from('teams')
          .select(`
            *, 
            players(*)
          `)
          .in('id', teamIds);
        
        if (joinedError) {
          console.error("Error fetching joined teams:", joinedError);
          throw joinedError;
        }

        joinedTeams = joinedTeamsData || [];
        console.log("Joined teams:", joinedTeams);
      }

      // **NEW: Get teams where user is a coach (by user_id or email)**
      let coachTeams: any[] = [];
      
      // First, check by user_id
      const { data: coachTeamsByUserId, error: coachUserIdError } = await supabase
        .from('team_coaches')
        .select('team_id')
        .eq('user_id', user.id);
      
      if (coachUserIdError) {
        console.error("Error fetching coach teams by user_id:", coachUserIdError);
      }

      // Then check by email if we have it
      let coachTeamsByEmail: any[] = [];
      if (user.email) {
        const { data: coachEmailData, error: coachEmailError } = await supabase
          .from('team_coaches')
          .select('team_id')
          .eq('email', user.email);
        
        if (coachEmailError) {
          console.error("Error fetching coach teams by email:", coachEmailError);
        } else {
          coachTeamsByEmail = coachEmailData || [];
        }
      }

      // Combine coach team IDs from both sources
      const allCoachTeamIds = [
        ...(coachTeamsByUserId || []).map(c => c.team_id),
        ...coachTeamsByEmail.map(c => c.team_id)
      ];
      
      // Remove duplicates
      const uniqueCoachTeamIds = [...new Set(allCoachTeamIds)];
      
      console.log("Coach team IDs:", uniqueCoachTeamIds);

      if (uniqueCoachTeamIds.length > 0) {
        const { data: coachTeamsData, error: coachTeamsError } = await supabase
          .from('teams')
          .select(`
            *, 
            players(*)
          `)
          .in('id', uniqueCoachTeamIds);
        
        if (coachTeamsError) {
          console.error("Error fetching coach teams:", coachTeamsError);
        } else {
          coachTeams = coachTeamsData || [];
          console.log("Coach teams:", coachTeams);
        }
      }
      
      // Combine and deduplicate teams from all sources
      const allTeams = [...(createdTeams || []), ...joinedTeams, ...coachTeams];
      const uniqueTeams = allTeams.filter((team, index, self) => 
        index === self.findIndex(t => t.id === team.id)
      );
      
      console.log("All unique teams:", uniqueTeams);
      
      const teamsWithPlayerCount = uniqueTeams.map(team => ({
        ...team,
        playerCount: team.players?.length || 0,
        isCreator: team.created_by === user.id
      })) as TeamWithCreatorInfo[];
      
      setAllUserTeams(teamsWithPlayerCount);
    } catch (error: any) {
      console.error("Error fetching teams:", error.message);
      toast.error("Failed to load teams");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateTeam = async (newTeam: Team) => {
    try {
      if (!user?.id) {
        toast.error("You must be logged in to create a team");
        return;
      }
      
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
          coach_id: user.id,
          created_by: user.id
        }])
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        toast.success(`Team "${newTeam.name}" created successfully`);
        // Refresh teams list
        fetchAllUserTeams();
      }
    } catch (error: any) {
      console.error("Error creating team:", error.message);
      toast.error("Failed to create team");
    } finally {
      setIsCreateTeamOpen(false);
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
  
  const handleTeamClick = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };

  const handleLeaveTeamClick = (team: TeamWithCreatorInfo) => {
    setSelectedTeamToLeave(team);
    setIsLeaveDialogOpen(true);
  };

  const handleConfirmLeaveTeam = async () => {
    if (!selectedTeamToLeave) return;
    
    try {
      if (!user?.id) return;
      
      // Remove from team_members table
      const { error: memberError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', selectedTeamToLeave.id)
        .eq('user_id', user.id);
      
      if (memberError) throw memberError;
      
      // Also update user_profiles.joined_teams for backward compatibility
      const { data: userProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('joined_teams')
        .eq('id', user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Error fetching user profile:", fetchError);
      } else if (userProfile) {
        const updatedJoinedTeams = (userProfile.joined_teams || []).filter(id => id !== selectedTeamToLeave.id);
        
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ joined_teams: updatedJoinedTeams })
          .eq('id', user.id);
        
        if (updateError) {
          console.error("Error updating user profile:", updateError);
        }
      }
      
      toast.success("Left team successfully");
      fetchAllUserTeams(); // Refresh the teams list
      setIsLeaveDialogOpen(false);
      setSelectedTeamToLeave(null);
    } catch (error: any) {
      console.error("Error leaving team:", error.message);
      toast.error("Failed to leave team");
    }
  };
  
  // Check for pending invitations on mount and when user changes
  useEffect(() => {
    if (user && invitations.length > 0 && showInvitationBanner) {
      // Auto-show invitations dialog if user has pending invitations
      const timer = setTimeout(() => {
        setIsInvitationsDialogOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user, invitations.length, showInvitationBanner]);

  const handleAcceptInvitation = async (invitationId: string) => {
    const success = await acceptInvitation(invitationId);
    if (success) {
      // Refresh teams list after accepting invitation
      fetchAllUserTeams();
    }
    return success;
  };

  return (
    <div className="pb-20">
      <div className="p-4">
        <Header title="My Teams" />
        
        {/* Invitation notification banner */}
        {invitations.length > 0 && showInvitationBanner && (
          <InvitationNotificationBanner
            invitations={invitations}
            onViewInvitations={() => setIsInvitationsDialogOpen(true)}
            onDismiss={() => setShowInvitationBanner(false)}
          />
        )}
        
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">My Teams</h2>
          {isCoach && (
            <Button 
              onClick={() => setIsCreateTeamOpen(true)}
              className="bg-blitz-purple hover:bg-blitz-purple/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> New Team
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blitz-purple"></div>
          </div>
        ) : allUserTeams.length === 0 ? (
          <Card className="bg-blitz-darkgray border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle>No Teams Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                {isCoach 
                  ? "You haven't created any teams yet. Get started by creating your first team."
                  : "You haven't joined any teams yet. Use the search feature to find and join teams."
                }
              </p>
              {isCoach ? (
                <Button 
                  onClick={() => setIsCreateTeamOpen(true)}
                  className="w-full bg-blitz-purple hover:bg-blitz-purple/90"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Team
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate('/search')}
                  className="w-full bg-blitz-purple hover:bg-blitz-purple/90"
                >
                  Search Teams
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allUserTeams.map((team) => (
              <div key={team.id} className="relative">
                <TeamCard 
                  team={{
                    ...team,
                    playerCount: team.players?.length || 0
                  }} 
                  onClick={() => handleTeamClick(team.id)} 
                />
                {!team.isCreator && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLeaveTeamClick(team);
                    }}
                  >
                    Leave
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {isCoach && (
        <CreateTeamDialog 
          open={isCreateTeamOpen}
          onOpenChange={setIsCreateTeamOpen}
          onCreateTeam={handleCreateTeam}
          userId={user?.id || ''}
        />
      )}

      <LeaveTeamDialog
        open={isLeaveDialogOpen}
        onOpenChange={setIsLeaveDialogOpen}
        team={selectedTeamToLeave}
        onConfirmLeave={handleConfirmLeaveTeam}
      />
      
      {/* Pending invitations dialog */}
      <PendingInvitationsDialog
        open={isInvitationsDialogOpen}
        onOpenChange={setIsInvitationsDialogOpen}
        invitations={invitations}
        onAccept={handleAcceptInvitation}
        onDecline={declineInvitation}
        isLoading={invitationsLoading}
      />
      
      <BottomNav />
    </div>
  );
};

export default TeamManagement;
