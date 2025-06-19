
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventActionsSectionProps {
  onAddToCalendar: () => void;
}

const EventActionsSection = ({ onAddToCalendar }: EventActionsSectionProps) => {
  return (
    <div className="flex gap-2 mt-6">
      <Button 
        className="flex-1 bg-blitz-purple hover:bg-blitz-purple/90"
        onClick={onAddToCalendar}
      >
        <Calendar className="w-4 h-4 mr-2" />
        Add to Calendar
      </Button>
    </div>
  );
};

export default EventActionsSection;
