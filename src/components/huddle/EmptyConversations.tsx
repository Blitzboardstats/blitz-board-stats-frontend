
import React from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyConversationsProps {
  onStartSearch: () => void;
}

const EmptyConversations = ({ onStartSearch }: EmptyConversationsProps) => {
  return (
    <Card className="bg-blitz-darkgray border-gray-800">
      <CardContent className="p-6 text-center">
        <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
        <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
        <p className="text-black mb-4">
          Search for guardians and parents above to start a conversation
        </p>
        <Button
          variant="outline"
          onClick={onStartSearch}
          className="bg-blitz-purple hover:bg-blitz-purple/90"
        >
          <Plus size={16} className="mr-2 text-white" />
          Start a conversation
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyConversations;
