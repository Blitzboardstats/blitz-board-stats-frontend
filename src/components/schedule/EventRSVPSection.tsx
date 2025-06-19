
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getResponseColor, getResponseText } from '@/utils/rsvpUtils';

interface EventRSVPSectionProps {
  userRSVP: any;
  isUpdating: boolean;
  onRSVP: (response: 'yes' | 'no' | 'maybe') => void;
}

const EventRSVPSection = ({ userRSVP, isUpdating, onRSVP }: EventRSVPSectionProps) => {
  return (
    <div className="mt-6 pt-4 border-t border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-black">Your RSVP:</div>
        {userRSVP && (
          <Badge variant="outline" className={getResponseColor(userRSVP.response)}>
            {getResponseText(userRSVP.response)}
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          className="bg-blitz-green/20 text-blitz-green border-blitz-green hover:bg-blitz-green hover:text-white"
          onClick={() => onRSVP('yes')}
          disabled={isUpdating}
        >
          Committed
        </Button>
        <Button 
          variant="outline" 
          className="bg-blue-600/30 text-blue-400 border-blue-500 hover:bg-blue-600/50"
          onClick={() => onRSVP('maybe')}
          disabled={isUpdating}
        >
          Pending
        </Button>
        <Button 
          variant="outline" 
          className="bg-red-600/20 text-red-400 border-red-800 hover:bg-red-600/30"
          onClick={() => onRSVP('no')}
          disabled={isUpdating}
        >
          No
        </Button>
      </div>
    </div>
  );
};

export default EventRSVPSection;
