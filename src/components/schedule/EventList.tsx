
import React from 'react';
import { Event } from '@/types/eventTypes';
import EventCard from '@/components/teams/schedule/EventCard';

interface EventListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  canManageTeam?: boolean;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (event: Event) => void;
}

const EventList = ({ 
  events, 
  onEventClick,
  canManageTeam = false,
  onEditEvent,
  onDeleteEvent 
}: EventListProps) => {
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          teamId={event.teamId}
          onEventClick={onEventClick}
          canManageTeam={canManageTeam}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
        />
      ))}
    </div>
  );
};

export default EventList;
