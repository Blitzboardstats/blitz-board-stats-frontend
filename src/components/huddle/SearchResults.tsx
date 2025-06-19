
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/hooks/useConversations';

interface SearchResultsProps {
  searchTerm: string;
  searchResults: UserProfile[];
  searching: boolean;
  onStartConversation: (user: UserProfile) => void;
}

const SearchResults = ({ searchTerm, searchResults, searching, onStartConversation }: SearchResultsProps) => {
  if (!searchTerm) return null;

  return (
    <Card className="bg-blitz-darkgray border-gray-800">
      <CardContent className="p-4">
        {searching ? (
          <div className="text-center py-4 text-black">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blitz-purple mx-auto mb-2"></div>
            Searching...
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-black mb-2">Search Results</h4>
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-blitz-darkgray/50 cursor-pointer"
                onClick={() => onStartConversation(user)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blitz-purple flex items-center justify-center text-sm font-semibold">
                    {(user.display_name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-black">
                      {user.display_name || user.email}
                    </div>
                    <div className="text-xs text-black">
                      <Badge variant="outline" className="text-xs">
                        {user.role || 'User'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <MessageCircle size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-black">
            No users found matching "{searchTerm}"
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchResults;
