import React, { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import EnhancedMessageComposer from '@/components/huddle/EnhancedMessageComposer';
import NotificationSettings from '@/components/huddle/NotificationSettings';
import { useUserTeams } from '@/hooks/useUserTeams';
import { useTeamDetails } from '@/hooks/useTeamDetails';
import HuddleHeader from '@/components/huddle/HuddleHeader';
import TeamFilter from '@/components/huddle/TeamFilter';
import HuddleTabsContainer from '@/components/huddle/HuddleTabsContainer';

const Huddle = () => {
  const { teams } = useUserTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(
    teams.length > 0 ? teams[0].id : null
  );
  const [activeTab, setActiveTab] = useState('announcements');
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isMessageComposerOpen, setIsMessageComposerOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNewPosts: true,
    pushNewPosts: true,
    emailComments: true,
    pushComments: true
  });
  
  const { posts, loading, createAnnouncement, deleteAnnouncement, likeAnnouncement, updateAnnouncement } = useAnnouncements(selectedTeamId);
  
  // Fetch team details when a team is selected
  const { 
    team, 
    coaches, 
    teamMembers, 
    isLoading: teamLoading 
  } = useTeamDetails(selectedTeamId || undefined);

  // Set initial team when teams are loaded
  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    console.log('Selected team for communication:', teamId);
  };

  const handleClearTeamSelection = () => {
    if (teams.length > 0) {
      setSelectedTeamId(teams[0].id);
    }
  };

  const handleSavePost = (title: string, content: string, allowComments: boolean, authorName: string, teamId?: string) => {
    createAnnouncement(title, content, allowComments, authorName, selectedTeamId || teamId);
    setIsNewPostOpen(false);
  };

  const handleSendMessage = (messageData: any) => {
    console.log('Sending message:', messageData);
    // TODO: Implement actual message sending logic
    setIsMessageComposerOpen(false);
    setSelectedRecipient(null);
  };

  const handleSaveNotificationSettings = (settings: typeof notificationSettings) => {
    setNotificationSettings(settings);
    setIsNotificationSettingsOpen(false);
    console.log('Notification settings saved:', settings);
    // TODO: Implement actual settings save logic
  };

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
  };

  const handleEditPost = (post: any) => {
    // TODO: Implement edit functionality
    console.log('Edit post:', post);
  };

  const handleDeletePost = (postId: string) => {
    deleteAnnouncement(postId);
  };

  const handleLikePost = (postId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    likeAnnouncement(postId);
  };

  const handlePostClick = (post: any) => {
    // TODO: Navigate to post details
    console.log('Post clicked:', post);
  };

  const handleSendMessageToMember = (member: any, type: 'player' | 'coach') => {
    setSelectedRecipient({ ...member, type });
    setIsMessageComposerOpen(true);
  };

  const selectedTeam = teams.find(team => team.id === selectedTeamId);
  const filteredPosts = selectedTeamId ? posts?.filter(post => post.team_id === selectedTeamId) : posts;

  // Show team selection if no teams are available
  if (teams.length === 0) {
    return (
      <div className="pb-20 min-h-screen">
        <div className="p-4 max-w-full overflow-x-hidden">
          <HuddleHeader />
          
          <div className="mb-6">
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">You haven't joined any teams yet.</p>
              <p className="text-sm text-gray-500">Join or create a team to access huddle features.</p>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen">
      <div className="p-4 max-w-full overflow-x-hidden">
        <HuddleHeader />

        <TeamFilter
          teams={teams}
          selectedTeamId={selectedTeamId}
          onTeamSelect={handleTeamSelect}
          onClearSelection={handleClearTeamSelection}
        />

        <HuddleTabsContainer
          onTabChange={handleTabChange}
          selectedTeam={selectedTeam}
          isNewPostOpen={isNewPostOpen}
          setIsNewPostOpen={setIsNewPostOpen}
          onSavePost={handleSavePost}
          loading={loading}
          teams={teams}
          selectedTeamId={selectedTeamId}
          filteredPosts={filteredPosts}
          onPostClick={handlePostClick}
          onLikePost={handleLikePost}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
          selectedConversation={selectedConversation}
          setIsMessageComposerOpen={setIsMessageComposerOpen}
          onSelectConversation={handleSelectConversation}
          onBackToConversations={handleBackToConversations}
          teamLoading={teamLoading}
          team={team}
          coaches={coaches}
          onSendMessageToMember={handleSendMessageToMember}
          notificationSettings={notificationSettings}
          setIsNotificationSettingsOpen={setIsNotificationSettingsOpen}
        />
      </div>
      
      {/* Message Composer Dialog */}
      <EnhancedMessageComposer 
        isOpen={isMessageComposerOpen} 
        onClose={() => {
          setIsMessageComposerOpen(false);
          setSelectedRecipient(null);
        }} 
        onSendMessage={handleSendMessage} 
      />
      
      {/* Notification Settings Dialog */}
      <NotificationSettings 
        open={isNotificationSettingsOpen} 
        onOpenChange={setIsNotificationSettingsOpen} 
        initialSettings={notificationSettings} 
        onSaveSettings={handleSaveNotificationSettings} 
      />
      
      <BottomNav />
    </div>
  );
};

export default Huddle;
