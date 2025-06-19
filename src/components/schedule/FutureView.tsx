
import React from 'react';
import { format, isFuture, isToday, startOfDay } from 'date-fns';
import { Event } from '@/types/eventTypes';
import { parseEventDate } from '@/utils/dateUtils';
import EventList from './EventList';

interface FutureViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  canManageTeam?: boolean;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (event: Event) => void;
}

const FutureView = ({ 
  events, 
  onEventClick,
  canManageTeam = false,
  onEditEvent,
  onDeleteEvent 
}: FutureViewProps) => {
  console.log('FutureView - All events:', events);

  // Filter for future and today's events
  const futureEvents = events.filter(event => {
    const eventDate = parseEventDate(event.date);
    const eventStartOfDay = startOfDay(eventDate);
    const today = startOfDay(new Date());
    const isFutureOrToday = eventStartOfDay >= today;
    console.log(`Event ${event.title} on ${format(eventDate, 'yyyy-MM-dd')} is future or today:`, isFutureOrToday);
    return isFutureOrToday;
  });

  // Sort by date ascending
  futureEvents.sort((a, b) => parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime());

  console.log('FutureView - Future events:', futureEvents);

  // Group events by date
  const eventsByDate = futureEvents.reduce((acc, event) => {
    const dateKey = format(parseEventDate(event.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const dateKeys = Object.keys(eventsByDate).sort();

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-4">Upcoming Events</h3>
      
      {dateKeys.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No upcoming events scheduled.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {dateKeys.map(dateKey => {
            const dayEvents = eventsByDate[dateKey];
            const eventDate = parseEventDate(dayEvents[0].date);
            
            return (
              <div key={dateKey} className="space-y-2">
                <h4 className="font-medium text-gray-300">
                  {isToday(eventDate) 
                    ? `Today - ${format(eventDate, 'MMMM d, yyyy')}`
                    : format(eventDate, 'EEEE, MMMM d, yyyy')
                  }
                </h4>
                <EventList 
                  events={dayEvents} 
                  onEventClick={onEventClick}
                  canManageTeam={canManageTeam}
                  onEditEvent={onEditEvent}
                  onDeleteEvent={onDeleteEvent}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FutureView;
