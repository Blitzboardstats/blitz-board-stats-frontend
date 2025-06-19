
import React from 'react';
import { MessageCircle } from 'lucide-react';

const HuddleHeader = () => {
  return (
    <div className="mb-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-2 flex items-center space-x-2 break-words">
        <MessageCircle className="text-blitz-purple flex-shrink-0" size={28} />
        <span className="break-words">🏈 Team Huddle</span>
      </h1>
      <p className="text-black text-sm sm:text-base break-words">
        Stay connected with your team through announcements, messaging, and more.
      </p>
    </div>
  );
};

export default HuddleHeader;
