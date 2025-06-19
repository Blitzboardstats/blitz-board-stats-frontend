
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import NewPost from '@/components/huddle/NewPost';
import HuddlePost from '@/components/huddle/HuddlePost';
import { HuddlePost as HuddlePostType } from '@/types/huddleTypes';

interface Team {
  id: string;
  name: string;
}

interface AnnouncementsTabProps {
  selectedTeam: Team | undefined;
  isNewPostOpen: boolean;
  setIsNewPostOpen: (open: boolean) => void;
  onSavePost: (title: string, content: string, allowComments: boolean, authorName: string, teamId?: string) => void;
  loading: boolean;
  teams: Team[];
  selectedTeamId: string | null;
  filteredPosts: HuddlePostType[] | undefined;
  onPostClick: (post: any) => void;
  onLikePost: (postId: string, event?: React.MouseEvent) => void;
  onEditPost: (post: any) => void;
  onDeletePost: (postId: string) => void;
}

const AnnouncementsTab = ({
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
  onDeletePost
}: AnnouncementsTabProps) => {
  return (
    <Card className="bg-blitz-darkgray border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg sm:text-xl break-words flex-1 pr-2 text-black">
          {selectedTeam ? `${selectedTeam.name} Announcements` : 'Team Announcements'}
        </CardTitle>
        <Plus
          size={20}
          className="text-green-500 cursor-pointer flex-shrink-0"
          onClick={() => setIsNewPostOpen(true)}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <NewPost 
          open={isNewPostOpen}
          onOpenChange={setIsNewPostOpen}
          onSavePost={onSavePost}
        />
        {loading && <p className="text-center text-black">Loading announcements...</p>}
        {teams.length === 0 && !loading && (
          <div className="text-center text-black py-8">
            <p>You need to join or create a team to see announcements.</p>
          </div>
        )}
        {selectedTeamId && filteredPosts?.length === 0 && !loading && (
          <div className="text-center text-black py-8">
            <p>No announcements yet for {selectedTeam?.name}.</p>
            <p className="text-sm">Be the first to post an announcement!</p>
          </div>
        )}
        <div className="space-y-4 max-w-full overflow-hidden">
          {filteredPosts?.map((post) => (
            <HuddlePost
              key={post.id}
              post={post}
              currentUserId="current-user"
              onPostClick={onPostClick}
              onLikePost={onLikePost}
              onEditPost={onEditPost}
              onDeletePost={onDeletePost}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementsTab;
