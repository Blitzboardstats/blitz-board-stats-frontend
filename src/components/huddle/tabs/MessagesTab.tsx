
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import ConversationList from '@/components/huddle/ConversationList';
import ChatInterface from '@/components/huddle/ChatInterface';

interface MessagesTabProps {
  selectedConversation: any;
  setIsMessageComposerOpen: (open: boolean) => void;
  onSelectConversation: (conversation: any) => void;
  onBackToConversations: () => void;
}

const MessagesTab = ({
  selectedConversation,
  setIsMessageComposerOpen,
  onSelectConversation,
  onBackToConversations
}: MessagesTabProps) => {
  return (
    <Card className="bg-blitz-darkgray border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg sm:text-xl break-words flex-1 pr-2 text-blue-900">Team Messages</CardTitle>
        {!selectedConversation && (
          <Plus
            size={20}
            className="text-green-500 cursor-pointer flex-shrink-0"
            onClick={() => setIsMessageComposerOpen(true)}
          />
        )}
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {selectedConversation ? (
          <div className="h-[70vh] sm:h-[600px]">
            <ChatInterface 
              conversation={selectedConversation} 
              onBack={onBackToConversations} 
            />
          </div>
        ) : (
          <div className="p-4 sm:p-0">
            <div className="max-w-full">
              <ConversationList onSelectConversation={onSelectConversation} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessagesTab;
