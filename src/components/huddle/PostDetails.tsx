
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Heart, MessageSquare, LockIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { HuddlePost, HuddleComment } from '@/types/huddleTypes';

interface PostDetailsProps {
  post: HuddlePost | null;
  currentUserId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLikePost: (postId: string) => void;
  onShowDirectMessage: () => void;
  onSendComment: (content: string, authorName: string) => void;
}

const PostDetails = ({
  post,
  currentUserId,
  open,
  onOpenChange,
  onLikePost,
  onShowDirectMessage,
  onSendComment
}: PostDetailsProps) => {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    if (!authorName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    onSendComment(commentText, authorName);
    setCommentText('');
    setAuthorName('');
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blitz-charcoal text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{post.title}</DialogTitle>
          <DialogDescription className="text-xs text-gray-400">
            {post.author_name} • {format(new Date(post.created_at), 'MMM d, h:mm a')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-gray-300">
            {post.content}
          </div>
          
          <div className="flex justify-between items-center">
            <button 
              className={`flex items-center text-sm ${post.liked_by.includes(currentUserId) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
              onClick={() => onLikePost(post.id)}
            >
              <Heart size={16} className="mr-1" fill={post.liked_by.includes(currentUserId) ? "currentColor" : "none"} />
              {post.likes} {post.likes === 1 ? 'like' : 'likes'}
            </button>
            
            <button 
              onClick={onShowDirectMessage}
              className="flex items-center text-blitz-purple hover:text-blitz-green transition-colors"
            >
              <MessageSquare size={16} className="mr-1" />
              <span className="text-sm">DM Coach</span>
            </button>
          </div>
          
          <div className="pt-3 border-t border-gray-800">
            <div className="text-sm font-medium mb-3">Comments</div>
            
            {post.allow_comments ? (
              <>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="bg-blitz-darkgray/70 p-3 rounded-md">
                      <div className="flex justify-between">
                        <div className="font-medium text-sm">{comment.author_name}</div>
                        <div className="text-xs text-gray-400">
                          {format(new Date(comment.created_at), 'h:mm a')}
                        </div>
                      </div>
                      <div className="text-sm mt-1 text-gray-300">{comment.content}</div>
                    </div>
                  ))}
                  
                  {post.comments.length === 0 && (
                    <div className="text-center text-gray-400 py-3">
                      No comments yet
                    </div>
                  )}
                </div>
                
                <form onSubmit={handleSendComment} className="pt-2 space-y-2">
                  <input
                    type="text"
                    className="w-full bg-blitz-darkgray border border-gray-700 rounded-lg p-2 text-white focus:outline-none text-sm"
                    placeholder="Your name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="flex-1 bg-blitz-darkgray border border-gray-700 rounded-l-lg p-3 text-white focus:outline-none"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="bg-blitz-purple p-3 rounded-r-lg text-white"
                    >
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center py-4 text-gray-400 bg-blitz-darkgray/40 rounded-md">
                <LockIcon size={16} className="mr-2" />
                <span>Comments are disabled for this announcement</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetails;
