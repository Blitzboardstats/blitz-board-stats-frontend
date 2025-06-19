
import React from 'react';
import { Event } from '@/types/eventTypes';
import FutureView from '@/components/schedule/FutureView';
import EventCard from './EventCard';
import { isPast } from 'date-fns';

interface ScheduleViewsProps {
  teamEvents: Event[];
  teamId: string;
  onEventClick: (event: Event) => void;
  canManageTeam?: boolean;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (event: Event) => void;
}

const ScheduleViews = ({
  teamEvents,
  teamId,
  onEventClick,
  canManageTeam = false,
  onEditEvent,
  onDeleteEvent,
}: ScheduleViewsProps) => {
  // Separate upcoming and past events
  const pastEvents = teamEvents.filter(event => isPast(event.date)).sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <>
      {/* Upcoming Events */}
      <FutureView 
        events={teamEvents}
        onEventClick={onEventClick}
        canManageTeam={canManageTeam}
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
      />

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-3 text-black">
            Past Events ({pastEvents.length})
          </h3>
          <div className="space-y-3">
            {pastEvents.slice(0, 5).map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                teamId={teamId} 
                onEventClick={onEventClick}
                canManageTeam={canManageTeam}
                onEditEvent={onEditEvent}
                onDeleteEvent={onDeleteEvent}
              />
            ))}
            {pastEvents.length > 5 && (
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Showing 5 of {pastEvents.length} past events
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ScheduleViews;
