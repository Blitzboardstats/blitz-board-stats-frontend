
import React from 'react';
import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Event } from '@/types/eventTypes';
import { parseEventDate } from '@/utils/dateUtils';
import EventList from './EventList';

interface WeekViewProps {
  selectedDate: Date | undefined;
  events: Event[];
  onEventClick: (event: Event) => void;
  canManageTeam?: boolean;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (event: Event) => void;
}

const WeekView = ({ 
  selectedDate, 
  events, 
  onEventClick,
  canManageTeam = false,
  onEditEvent,
  onDeleteEvent 
}: WeekViewProps) => {
  if (!selectedDate) {
    return <div>No date selected</div>;
  }

  console.log('WeekView - Selected date:', selectedDate);
  console.log('WeekView - All events:', events);

  // Get the week range
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Filter events for the current week
  const weekEvents = events.filter(event => {
    const eventDate = parseEventDate(event.date);
    const isInWeek = eventDate >= weekStart && eventDate <= weekEnd;
    console.log(`Event ${event.title} on ${format(eventDate, 'yyyy-MM-dd')} is in week:`, isInWeek);
    return isInWeek;
  });

  console.log('WeekView - Events for current week:', weekEvents);

  // Group events by day and filter out days with no events
  const eventsByDay = daysInWeek
    .map(day => ({
      date: day,
      events: weekEvents.filter(event => isSameDay(parseEventDate(event.date), day))
    }))
    .filter(dayData => dayData.events.length > 0); // Only show days with events

  console.log('WeekView - Days with events:', eventsByDay);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-4">
        Week of {format(weekStart, 'MMMM d')} - {format(weekEnd, 'MMMM d, yyyy')}
      </h3>
      
      {eventsByDay.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No events scheduled for this week.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {eventsByDay.map(({ date, events: dayEvents }) => (
            <div key={format(date, 'yyyy-MM-dd')} className="space-y-2">
              <h4 className="font-medium text-gray-300">
                {format(date, 'EEEE, MMMM d')}
              </h4>
              <EventList 
                events={dayEvents} 
                onEventClick={onEventClick}
                canManageTeam={canManageTeam}
                onEditEvent={onEditEvent}
                onDeleteEvent={onDeleteEvent}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeekView;
