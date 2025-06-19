
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isToday, isYesterday } from 'date-fns';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { Conversation, Message } from '@/hooks/useConversations';
import { toast } from 'sonner';

interface ChatInterfaceProps {
  conversation: Conversation;
  onBack: () => void;
}

const ChatInterface = ({ conversation, onBack }: ChatInterfaceProps) => {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useMessages(conversation.id);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const success = await sendMessage(newMessage);
    
    if (success) {
      setNewMessage('');
    } else {
      toast.error('Failed to send message');
    }
    
    setSending(false);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  const groupMessagesByDate = (messageList: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messageList.forEach(message => {
      const date = new Date(message.created_at);
      let dateKey;
      
      if (isToday(date)) {
        dateKey = 'Today';
      } else if (isYesterday(date)) {
        dateKey = 'Yesterday';
      } else {
        dateKey = format(date, 'MMMM d, yyyy');
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full max-w-full">
      {/* Header - Responsive */}
      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-gray-800">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-gray-400 hover:text-white flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
        >
          <ArrowLeft size={18} className="sm:hidden" />
          <ArrowLeft size={20} className="hidden sm:block" />
        </Button>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blitz-purple flex items-center justify-center text-sm sm:text-lg font-semibold flex-shrink-0">
          {(conversation.other_participant?.display_name || conversation.other_participant?.email || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm sm:text-base truncate">
            {conversation.other_participant?.display_name || conversation.other_participant?.email}
          </div>
          <div className="text-xs sm:text-sm text-gray-400 truncate">
            {conversation.other_participant?.role || 'User'}
          </div>
        </div>
      </div>

      {/* Messages - Responsive padding and sizing */}
      <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollRef}>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blitz-purple"></div>
          </div>
        ) : Object.keys(messageGroups).length === 0 ? (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <div className="text-center px-4">
              <div className="text-2xl sm:text-3xl mb-2">👋</div>
              <div className="text-sm sm:text-base">Start the conversation!</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 max-w-full">
            {Object.entries(messageGroups).map(([dateKey, dateMessages]) => (
              <div key={dateKey} className="max-w-full">
                {/* Date separator */}
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <div className="bg-blitz-darkgray px-2 sm:px-3 py-1 rounded-full text-xs text-gray-400">
                    {dateKey}
                  </div>
                </div>
                
                {/* Messages for this date */}
                <div className="space-y-2 sm:space-y-3">
                  {dateMessages.map((message) => {
                    const isFromCurrentUser = message.sender_id === user?.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'} px-1`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 break-words ${
                            isFromCurrentUser
                              ? 'bg-blitz-purple text-white'
                              : 'bg-blitz-darkgray text-white'
                          }`}
                        >
                          <div className="text-sm sm:text-base leading-relaxed">{message.content}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {format(new Date(message.created_at), 'h:mm a')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Message Input - Responsive */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-3 sm:p-4 border-t border-gray-800">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-blitz-darkgray border-gray-700 text-white placeholder-gray-400 rounded-full text-sm sm:text-base h-10 sm:h-12"
          disabled={sending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!newMessage.trim() || sending}
          className="rounded-full bg-blitz-purple hover:bg-blitz-purple/90 h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0"
        >
          {sending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          ) : (
            <Send size={16} className="sm:hidden" />
          )}
          {!sending && <Send size={18} className="hidden sm:block" />}
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
