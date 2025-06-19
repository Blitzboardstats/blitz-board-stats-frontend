
import React from 'react';
import { format } from 'date-fns';
import { MessageSquare, Heart, LockIcon, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { HuddlePost as HuddlePostType } from '@/types/huddleTypes';
import { useUserTeams } from '@/hooks/useUserTeams';

interface HuddlePostProps {
  post: HuddlePostType;
  currentUserId: string;
  onPostClick: (post: HuddlePostType) => void;
  onLikePost: (postId: string, event?: React.MouseEvent) => void;
  onEditPost?: (post: HuddlePostType) => void;
  onDeletePost?: (postId: string) => void;
}

const HuddlePost = ({ 
  post, 
  currentUserId, 
  onPostClick, 
  onLikePost, 
  onEditPost, 
  onDeletePost 
}: HuddlePostProps) => {
  const { teams } = useUserTeams();
  
  const handleLikeClick = (event: React.MouseEvent) => {
    onLikePost(post.id, event);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    onEditPost?.(post);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      onDeletePost?.(post.id);
    }
  };

  const canEdit = post.user_id === currentUserId;

  // Find the team for this post to show team info
  const team = teams.find(t => t.id === post.team_id);

  return (
    <Card 
      className="blitz-card cursor-pointer hover:border-blitz-purple/50 transition-colors"
      onClick={() => onPostClick(post)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="font-semibold text-lg">{post.title}</div>
              {team && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blitz-purple/10 text-blitz-purple border-blitz-purple/25 text-xs">
                    {team.name}
                  </Badge>
                  {team.roleDetails && (
                    <Badge variant="outline" className="bg-blitz-green/10 text-blitz-green border-blitz-green/25 text-xs">
                      {team.roleDetails}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {post.author_name} • {format(new Date(post.created_at), 'MMM d, h:mm a')}
            </div>
          </div>
          
          {canEdit && (onEditPost || onDeletePost) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-blitz-darkgray border-gray-700">
                {onEditPost && (
                  <DropdownMenuItem onClick={handleEdit} className="text-white hover:bg-blitz-purple/20">
                    <Edit size={14} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDeletePost && (
                  <DropdownMenuItem onClick={handleDelete} className="text-red-400 hover:bg-red-500/20">
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div className="mt-2 text-sm text-gray-300 line-clamp-2">
          {post.content}
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-400">
            {post.comments.length > 0 ? (
              <>
                <MessageSquare size={14} className="mr-1" />
                {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
              </>
            ) : !post.allow_comments ? (
              <div className="flex items-center">
                <LockIcon size={14} className="mr-1" />
                <span>Comments disabled</span>
              </div>
            ) : null}
          </div>
          
          <button 
            className="flex items-center text-xs hover:text-blitz-purple transition-colors"
            onClick={handleLikeClick}
          >
            <Heart size={14} className={`mr-1 ${post.liked_by.includes(currentUserId) ? 'text-red-500' : 'text-red-500'}`} fill={post.liked_by.includes(currentUserId) ? "currentColor" : "none"} />
            <span className="text-blitz-purple">{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HuddlePost;
