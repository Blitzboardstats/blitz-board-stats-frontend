
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Users, Bell } from 'lucide-react';
import AnnouncementsTab from './tabs/AnnouncementsTab';
import MessagesTab from './tabs/MessagesTab';
import RosterTab from './tabs/RosterTab';
import NotificationsTab from './tabs/NotificationsTab';
import { HuddlePost } from '@/types/huddleTypes';
import { TeamCoach } from '@/types/teamTypes';
import { Player } from '@/types/playerTypes';

interface Team {
  id: string;
  name: string;
  players?: Player[];
}

interface HuddleTabsContainerProps {
  onTabChange: (value: string) => void;
  selectedTeam: Team | undefined;
  isNewPostOpen: boolean;
  setIsNewPostOpen: (open: boolean) => void;
  onSavePost: (title: string, content: string, allowComments: boolean, authorName: string, teamId?: string) => void;
  loading: boolean;
  teams: Team[];
  selectedTeamId: string | null;
  filteredPosts: HuddlePost[] | undefined;
  onPostClick: (post: any) => void;
  onLikePost: (postId: string, event?: React.MouseEvent) => void;
  onEditPost: (post: any) => void;
  onDeletePost: (postId: string) => void;
  selectedConversation: any;
  setIsMessageComposerOpen: (open: boolean) => void;
  onSelectConversation: (conversation: any) => void;
  onBackToConversations: () => void;
  teamLoading: boolean;
  team: Team | null;
  coaches: TeamCoach[];
  onSendMessageToMember: (member: any, type: 'player' | 'coach') => void;
  notificationSettings: {
    emailNewPosts: boolean;
    pushNewPosts: boolean;
    emailComments: boolean;
    pushComments: boolean;
  };
  setIsNotificationSettingsOpen: (open: boolean) => void;
}

const HuddleTabsContainer = ({
  onTabChange,
  selectedTeam,
  isNewPostOpen,
  setIsNewPostOpen,
  onSavePost,
  loading,
  teams,
  selectedTeamId,
  filteredPosts,
  onPostClick,
  onLikePost,
  onEditPost,
  onDeletePost,
  selectedConversation,
  setIsMessageComposerOpen,
  onSelectConversation,
  onBackToConversations,
  teamLoading,
  team,
  coaches,
  onSendMessageToMember,
  notificationSettings,
  setIsNotificationSettingsOpen
}: HuddleTabsContainerProps) => {
  return (
    <Tabs defaultValue="announcements" className="space-y-6 w-full" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-blitz-darkgray gap-1 h-auto p-1">
        <TabsTrigger 
          value="announcements" 
          className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 data-[state=active]:bg-blitz-purple text-xs sm:text-sm px-2 py-2 h-auto min-h-[60px] sm:min-h-[40px]"
        >
          <Bell size={16} className="flex-shrink-0" />
          <span className="text-center break-words">Announcements</span>
        </TabsTrigger>
        <TabsTrigger 
          value="messages" 
          className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 data-[state=active]:bg-blitz-purple text-xs sm:text-sm px-2 py-2 h-auto min-h-[60px] sm:min-h-[40px]"
        >
          <MessageCircle size={16} className="flex-shrink-0" />
          <span className="text-center break-words">Messages</span>
        </TabsTrigger>
        <TabsTrigger 
          value="roster" 
          className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 data-[state=active]:bg-blitz-purple text-xs sm:text-sm px-2 py-2 h-auto min-h-[60px] sm:min-h-[40px]"
        >
          <Users size={16} className="flex-shrink-0" />
          <span className="text-center break-words">Roster</span>
        </TabsTrigger>
        <TabsTrigger 
          value="notifications" 
          className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 data-[state=active]:bg-blitz-purple text-xs sm:text-sm px-2 py-2 h-auto min-h-[60px] sm:min-h-[40px]"
        >
          <Bell size={16} className="flex-shrink-0" />
          <span className="text-center break-words">Notifications</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="announcements">
        <AnnouncementsTab
          selectedTeam={selectedTeam}
          isNewPostOpen={isNewPostOpen}
          setIsNewPostOpen={setIsNewPostOpen}
          onSavePost={onSavePost}
          loading={loading}
          teams={teams}
          selectedTeamId={selectedTeamId}
          filteredPosts={filteredPosts}
          onPostClick={onPostClick}
          onLikePost={onLikePost}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
        />
      </TabsContent>

      <TabsContent value="messages">
        <MessagesTab
          selectedConversation={selectedConversation}
          setIsMessageComposerOpen={setIsMessageComposerOpen}
          onSelectConversation={onSelectConversation}
          onBackToConversations={onBackToConversations}
        />
      </TabsContent>

      <TabsContent value="roster">
        <RosterTab
          teams={teams}
          selectedTeamId={selectedTeamId}
          selectedTeam={selectedTeam}
          teamLoading={teamLoading}
          team={team}
          coaches={coaches}
          onSendMessageToMember={onSendMessageToMember}
        />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationsTab
          notificationSettings={notificationSettings}
          setIsNotificationSettingsOpen={setIsNotificationSettingsOpen}
        />
      </TabsContent>
    </Tabs>
  );
};

export default HuddleTabsContainer;
