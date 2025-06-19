
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { HuddlePost } from '@/types/huddleTypes';

interface EditAnnouncementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: HuddlePost | null;
  onSavePost: (id: string, title: string, content: string, allowComments: boolean, authorName: string) => void;
}

const EditAnnouncement = ({ open, onOpenChange, post, onSavePost }: EditAnnouncementProps) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [allowComments, setAllowComments] = useState<boolean>(true);
  const [authorName, setAuthorName] = useState<string>("");

  useEffect(() => {
    if (post && open) {
      setTitle(post.title);
      setContent(post.content);
      setAllowComments(post.allow_comments);
      setAuthorName(post.author_name);
    }
  }, [post, open]);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setTitle("");
        setContent("");
        setAllowComments(true);
        setAuthorName("");
      }, 200);
    }
  }, [open]);

  const handleSave = () => {
    if (!post) return;
    onSavePost(post.id, title, content, allowComments, authorName);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blitz-charcoal text-white border-gray-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Announcement</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="authorName">Posted by</Label>
            <Input 
              id="authorName"
              value={authorName} 
              onChange={(e) => setAuthorName(e.target.value)} 
              placeholder="Your name"
              className="mt-1 input-field"
            />
          </div>

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

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="allowComments" 
                checked={allowComments} 
                onCheckedChange={setAllowComments} 
              />
              <Label htmlFor="allowComments">Allow Comments</Label>
            </div>
            
            <Button 
              onClick={handleSave} 
              disabled={!title.trim() || !content.trim() || !authorName.trim()}
              className="bg-blitz-purple hover:bg-blitz-purple/90"
            >
              Update Announcement
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAnnouncement;
