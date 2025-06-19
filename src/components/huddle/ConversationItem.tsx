
import React from 'react';
import { Dot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isYesterday } from 'date-fns';
import { Conversation } from '@/hooks/useConversations';

interface ConversationItemProps {
  conversation: Conversation;
  isRecent: boolean;
  onSelect: (conversation: Conversation) => void;
}

const ConversationItem = ({ conversation, isRecent, onSelect }: ConversationItemProps) => {
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  return (
    <Card
      className={`bg-blitz-darkgray border-gray-800 cursor-pointer hover:border-blitz-purple/50 transition-colors ${
        isRecent ? 'border-blitz-purple/30' : ''
      }`}
      onClick={() => onSelect(conversation)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-blitz-purple flex items-center justify-center text-lg font-semibold">
              {(conversation.other_participant?.display_name || conversation.other_participant?.email || 'U').charAt(0).toUpperCase()}
            </div>
            {isRecent && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blitz-green rounded-full flex items-center justify-center">
                <Dot className="text-white" size={12} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="font-medium truncate text-black">
                {conversation.other_participant?.display_name || conversation.other_participant?.email}
              </div>
              {conversation.last_message && (
                <div className="text-xs text-gray-400">
                  {formatMessageTime(conversation.last_message.created_at)}
                </div>
              )}
            </div>
            {conversation.other_participant?.role && (
              <Badge variant="outline" className="text-xs mb-1">
                {conversation.other_participant.role}
              </Badge>
            )}
            {conversation.last_message && (
              <div className={`text-sm truncate ${isRecent ? 'text-gray-600 font-medium' : 'text-black'}`}>
                {conversation.last_message.content}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationItem;
