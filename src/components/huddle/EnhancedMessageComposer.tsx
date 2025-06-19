import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MessageRecipient, MessageRecipientRole } from '@/types/huddleTypes';
import { Upload, Users, Send } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedMessageComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (data: MessageData) => void;
}

interface MessageData {
  recipients: MessageRecipient[];
  subject: string;
  content: string;
  isUrgent: boolean;
  mediaFiles: File[];
}

const EnhancedMessageComposer = ({ isOpen, onClose, onSendMessage }: EnhancedMessageComposerProps) => {
  const [recipients, setRecipients] = useState<MessageRecipient[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleRecipientToggle = (id: string) => {
    setRecipients(recipients.map(r =>
      r.id === id ? { ...r, is_selected: !r.is_selected } : r
    ));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles([...mediaFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const sendMessage = () => {
    const selectedRecipients = recipients.filter(r => r.is_selected);

    if (selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient.');
      return;
    }

    if (!subject.trim() || !content.trim()) {
      toast.error('Subject and content cannot be empty.');
      return;
    }

    const messageData: MessageData = {
      recipients: selectedRecipients,
      subject: subject,
      content: content,
      isUrgent: isUrgent,
      mediaFiles: mediaFiles,
    };

    onSendMessage(messageData);
    onClose();
  };

  const mockTeamMembers: MessageRecipient[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'coach' as MessageRecipientRole,
      team_id: 'team1',
      is_selected: false,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'parent' as MessageRecipientRole,
      team_id: 'team1',
      is_selected: false,
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike@example.com',
      role: 'player' as MessageRecipientRole,
      team_id: 'team1',
      is_selected: false,
    },
  ];

  useEffect(() => {
    // Load recipients (replace with actual data fetching)
    setRecipients(mockTeamMembers);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Compose New Message</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recipients" className="text-right">
              Recipients
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Users className="h-4 w-4 mr-1 text-gray-500" />
              <div className="flex flex-wrap gap-1">
                {recipients.map(recipient => (
                  <Badge
                    key={recipient.id}
                    variant={recipient.is_selected ? 'default' : 'secondary'}
                    onClick={() => handleRecipientToggle(recipient.id)}
                    className="cursor-pointer"
                  >
                    {recipient.name} ({recipient.role})
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isUrgent" className="text-right">
              Urgent
            </Label>
            <div className="col-span-3 flex items-center">
              <Checkbox
                id="isUrgent"
                checked={isUrgent}
                onCheckedChange={(checked) => setIsUrgent(!!checked)}
              />
              <Label htmlFor="isUrgent" className="ml-2">
                Mark as Urgent
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mediaFiles" className="text-right">
              Attachments
            </Label>
            <div className="col-span-3">
              <Input
                type="file"
                id="mediaFiles"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <Label htmlFor="mediaFiles" className="flex items-center space-x-2 cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Upload Files</span>
              </Label>
              {mediaFiles.length > 0 && (
                <div className="mt-2">
                  {mediaFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-100 rounded-md">
                      <span>{file.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" onClick={sendMessage}>
            Send Message
            <Send className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedMessageComposer;
