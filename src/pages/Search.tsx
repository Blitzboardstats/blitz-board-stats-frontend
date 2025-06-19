
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';
import CreateTeamDialog from '@/components/teams/CreateTeamDialog';

// New components
import SearchHeader from '@/components/search/SearchHeader';
import SearchStates, { UnauthenticatedState } from '@/components/search/SearchStates';
import TeamSearchResults from '@/components/search/TeamSearchResults';

// New hooks
import { useTeamSearch } from '@/hooks/useTeamSearch';
import { useJoinedTeams } from '@/hooks/useJoinedTeams';

const Search = () => {
  const { user, isCoach, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  // Custom hooks
  const { searchTerm, setSearchTerm, teams, isLoading } = useTeamSearch();
  const { joinedTeams, joinTeam } = useJoinedTeams(user?.id);

  console.log('Search Page - Auth State:', { user: user?.email, isAuthenticated, loading, isCoach });

  const viewTeam = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };

  const handleCreateTeam = async (teamData: any) => {
    if (!user) {
      toast.error('You must be logged in to create a team');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{
          ...teamData,
          coach_id: user.id,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Team created successfully!');
      setIsCreateTeamOpen(false);
      return true;
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast.error('Failed to create team');
      return false;
    }
  };

  // Show loading state while authentication is being determined
  if (loading) {
    return (
      <div className="pb-20">
        <div className="p-4">
          <SearchHeader 
            searchTerm=""
            onSearchChange={() => {}}
            isCoach={false}
            onCreateTeam={() => {}}
          />
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blitz-purple mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Show error if not authenticated after loading completes
  if (!isAuthenticated) {
    return (
      <div className="pb-20">
        <div className="p-4">
          <SearchHeader 
            searchTerm=""
            onSearchChange={() => {}}
            isCoach={false}
            onCreateTeam={() => {}}
          />
          <UnauthenticatedState onLogin={() => navigate('/login')} />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="p-4">
        <SearchHeader 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isCoach={isCoach}
          onCreateTeam={() => setIsCreateTeamOpen(true)}
        />

        <SearchStates 
          isLoading={isLoading}
          searchTerm={searchTerm}
          teamsCount={teams.length}
          onLogin={() => navigate('/login')}
        />

        {!isLoading && teams.length > 0 && (
          <TeamSearchResults 
            teams={teams}
            joinedTeams={joinedTeams}
            currentUserId={user?.id}
            onJoinTeam={joinTeam}
            onViewTeam={viewTeam}
          />
        )}
      </div>

      <CreateTeamDialog
        open={isCreateTeamOpen}
        onOpenChange={setIsCreateTeamOpen}
        onCreateTeam={handleCreateTeam}
        userId={user?.id || ''}
      />
      
      <BottomNav />
    </div>
  );
};

export default Search;
