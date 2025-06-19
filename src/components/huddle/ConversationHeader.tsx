
import React from 'react';
import { MessageCircle } from 'lucide-react';

const ConversationHeader = () => {
  return (
    <div className="bg-blitz-darkgray/50 border border-blitz-purple/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="text-blitz-purple" size={20} />
        <h3 className="text-lg font-medium text-blue-900">Team Messages</h3>
      </div>
      <p className="text-sm text-black">
        All conversations stay within BlitzBoard Stats to maintain <span className="text-blue-900 font-medium">team messages</span> history and context.
      </p>
    </div>
  );
};

export default ConversationHeader;
