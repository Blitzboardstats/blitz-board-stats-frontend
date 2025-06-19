
import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useConversations, UserProfile } from '@/hooks/useConversations';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { toast } from 'sonner';
import ConversationHeader from './ConversationHeader';
import SearchResults from './SearchResults';
import ConversationItem from './ConversationItem';
import EmptyConversations from './EmptyConversations';

interface ConversationListProps {
  onSelectConversation: (conversation: any) => void;
}

const ConversationList = ({ onSelectConversation }: ConversationListProps) => {
  const { user } = useAuth();
  const { conversations, loading, searchUsers, startConversation } = useConversations();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchUsers(term);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleStartConversation = async (user: UserProfile) => {
    const conversationId = await startConversation(user.id);
    if (conversationId) {
      setShowSearch(false);
      setSearchTerm('');
      setSearchResults([]);
      // Find and select the conversation
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        onSelectConversation(conversation);
      }
    } else {
      toast.error('Failed to start conversation');
    }
  };

  // Simple check for "unread" messages (messages sent by other users in the last hour)
  const hasRecentMessages = (conversation: any) => {
    if (!conversation.last_message || !user) return false;
    
    const messageDate = new Date(conversation.last_message.created_at);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    return conversation.last_message.sender_id !== user.id && messageDate > oneHourAgo;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blitz-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ConversationHeader />

      {/* Search Header */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search for users to message..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowSearch(true)}
            className="pl-10 bg-blitz-darkgray border-gray-700 text-black placeholder-gray-400"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSearch(!showSearch)}
          className="bg-blitz-purple hover:bg-blitz-purple/90"
        >
          <Plus size={16} className="text-white" />
        </Button>
      </div>

      {/* Search Results */}
      {showSearch && (
        <SearchResults
          searchTerm={searchTerm}
          searchResults={searchResults}
          searching={searching}
          onStartConversation={handleStartConversation}
        />
      )}

      {/* Conversations List */}
      {conversations.length === 0 ? (
        <EmptyConversations onStartSearch={() => setShowSearch(true)} />
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => {
            const isRecent = hasRecentMessages(conversation);
            
            return (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isRecent={isRecent}
                onSelect={onSelectConversation}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConversationList;
