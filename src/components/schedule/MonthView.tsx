
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '@/types/eventTypes';
import EventList from './EventList';

interface MonthViewProps {
  viewDate: Date;
  events: Event[];
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  onEventClick: (event: Event) => void;
}

const MonthView = ({
  viewDate,
  events,
  handlePrevMonth,
  handleNextMonth,
  onEventClick
}: MonthViewProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-blitz-darkgray">
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-lg font-medium">
          {format(viewDate, 'MMMM yyyy')}
        </h2>
        
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-blitz-darkgray">
          <ChevronRight size={20} />
        </button>
      </div>
      
      <EventList events={events} onEventClick={onEventClick} />
    </div>
  );
};

export default MonthView;
