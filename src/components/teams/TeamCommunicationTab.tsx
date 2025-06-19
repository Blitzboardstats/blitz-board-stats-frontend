
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Megaphone, Settings } from 'lucide-react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useAuth } from '@/contexts/AuthContextOptimized';
import AnnouncementsTab from '@/components/huddle/tabs/AnnouncementsTab';
import MessagesTab from '@/components/huddle/tabs/MessagesTab';
import NotificationsTab from '@/components/huddle/tabs/NotificationsTab';
import EnhancedMessageComposer from '@/components/huddle/EnhancedMessageComposer';
import NotificationSettings from '@/components/huddle/NotificationSettings';

interface TeamCommunicationTabProps {
  teamId: string;
  teamName?: string;
  canManageTeam: boolean;
}

const TeamCommunicationTab = ({ teamId, teamName, canManageTeam }: TeamCommunicationTabProps) => {
  const { user } = useAuth();
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

  const { posts, loading, createAnnouncement, deleteAnnouncement, likeAnnouncement, updateAnnouncement } = useAnnouncements(teamId);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSavePost = (title: string, content: string, allowComments: boolean, authorName: string) => {
    createAnnouncement(title, content, allowComments, authorName, teamId);
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

  const selectedTeam = { id: teamId, name: teamName || 'Team' };
  const filteredPosts = posts?.filter(post => post.team_id === teamId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageCircle className="text-blitz-purple" size={24} />
        <h3 className="text-xl font-semibold">Team Huddle</h3>
      </div>

      {/* Communication Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-blitz-darkgray">
          <TabsTrigger value="announcements" className="data-[state=active]:bg-blitz-purple flex items-center gap-2">
            <Megaphone size={16} />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-blitz-purple flex items-center gap-2">
            <MessageCircle size={16} />
            Messages
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-blitz-purple flex items-center gap-2">
            <Settings size={16} />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="mt-6">
          <AnnouncementsTab
            selectedTeam={selectedTeam}
            isNewPostOpen={isNewPostOpen}
            setIsNewPostOpen={setIsNewPostOpen}
            onSavePost={handleSavePost}
            loading={loading}
            teams={[selectedTeam]}
            selectedTeamId={teamId}
            filteredPosts={filteredPosts}
            onPostClick={handlePostClick}
            onLikePost={handleLikePost}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
          />
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <MessagesTab
            selectedConversation={selectedConversation}
            setIsMessageComposerOpen={setIsMessageComposerOpen}
            onSelectConversation={handleSelectConversation}
            onBackToConversations={handleBackToConversations}
          />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationsTab
            notificationSettings={notificationSettings}
            setIsNotificationSettingsOpen={setIsNotificationSettingsOpen}
          />
        </TabsContent>
      </Tabs>

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
    </div>
  );
};

export default TeamCommunicationTab;
