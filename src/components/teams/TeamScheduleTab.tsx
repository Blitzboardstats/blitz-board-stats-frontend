
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeamEventsQuery } from '@/hooks/useTeamEventsQuery';
import { useEventMutations } from '@/hooks/useEventMutations';
import { useUserTeamsQuery } from '@/hooks/useUserTeamsQuery';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { usePermissions } from '@/hooks/usePermissions';
import ScheduleViews from './schedule/ScheduleViews';
import CreateEventSection from './schedule/CreateEventSection';
import { Event, NewEventForm } from '@/types/eventTypes';

interface TeamScheduleTabProps {
  teamId: string;
  canManageTeam?: boolean;
}

const TeamScheduleTab = ({ teamId, canManageTeam = false }: TeamScheduleTabProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: events = [], isLoading: eventsLoading, refetch: refetchEvents } = useTeamEventsQuery();
  const { data: userTeams = [] } = useUserTeamsQuery();
  const { permissions } = usePermissions(teamId);
  const { updateEvent, deleteEvent, createEvent, isCreating } = useEventMutations();

  // Event creation state
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newEvent, setNewEvent] = useState<NewEventForm>({
    title: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    type: 'Practice',
    opponent: '',
    teamId: teamId,
    duration: undefined,
    matchupFormat: undefined,
    notes: '',
    ageGroups: [],
    endDate: '',
    prizeDetails: '',
    registrationFee: '',
    selectedTeams: [],
    isMultiTeam: false,
  });

  console.log('TeamScheduleTab - teamId:', teamId);
  console.log('TeamScheduleTab - canManageTeam prop:', canManageTeam);
  console.log('TeamScheduleTab - user:', user?.email, 'role:', user?.role);
  console.log('TeamScheduleTab - permissions.canCreateEvents:', permissions.canCreateEvents);
  console.log('TeamScheduleTab - permissions.canManageTeam:', permissions.canManageTeam);

  const handleEventUpdate = async (event: Event) => {
    try {
      await updateEvent({
        id: event.id,
        updates: {
          title: event.title,
          date: event.date.toISOString().split('T')[0],
          time: event.time,
          endTime: event.endTime,
          location: event.location,
          type: event.type,
          opponent: event.opponent,
          teamCount: event.teamCount,
          duration: event.duration,
          matchupFormat: event.matchupFormat,
          notes: event.notes,
          ageGroups: event.ageGroups,
          teamId: event.teamId
        }
      });
      refetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleEventDelete = async (event: Event) => {
    try {
      await deleteEvent(event.id);
      refetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEventClick = (event: Event) => {
    console.log('Event clicked:', event);
    navigate(`/event/${event.id}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventTypeChange = (type: 'Game' | 'Practice' | 'Tournament') => {
    setNewEvent(prev => ({
      ...prev,
      type,
      // Reset type-specific fields when changing type
      opponent: type === 'Game' ? prev.opponent : '',
      teamCount: type === 'Tournament' ? prev.teamCount : undefined,
      duration: type === 'Game' ? prev.duration : undefined,
      matchupFormat: type === 'Game' ? prev.matchupFormat : undefined,
    }));
  };

  const handleCreateEvent = () => {
    setShowCreateEvent(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent(newEvent);
      setShowCreateEvent(false);
      // Reset form
      setNewEvent({
        title: '',
        date: '',
        time: '',
        endTime: '',
        location: '',
        type: 'Practice',
        opponent: '',
        teamId: teamId,
        duration: undefined,
        matchupFormat: undefined,
        notes: '',
        ageGroups: [],
        endDate: '',
        prizeDetails: '',
        registrationFee: '',
        selectedTeams: [],
        isMultiTeam: false,
      });
      refetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  // Use the comprehensive permissions check from usePermissions
  const effectiveCanManageTeam = canManageTeam || permissions.canManageTeam || permissions.canCreateEvents;
  console.log('TeamScheduleTab - effectiveCanManageTeam:', effectiveCanManageTeam);

  return (
    <div className="space-y-6">
      {/* Header with Add Event Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-blitz-purple">Team Schedule</h2>
        <CreateEventSection
          canManageTeam={effectiveCanManageTeam}
          teamId={teamId}
          selectedDate={selectedDate}
          showCreateEvent={showCreateEvent}
          setShowCreateEvent={setShowCreateEvent}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          userTeams={userTeams}
          isCreating={isCreating}
          onCreateEvent={handleCreateEvent}
          onInputChange={handleInputChange}
          onEventTypeChange={handleEventTypeChange}
          onSaveEvent={handleSaveEvent}
        />
      </div>

      {/* Schedule Views */}
      <ScheduleViews
        teamEvents={events}
        teamId={teamId}
        onEventClick={handleEventClick}
        canManageTeam={effectiveCanManageTeam}
        onEditEvent={handleEventUpdate}
        onDeleteEvent={handleEventDelete}
      />
    </div>
  );
};

export default TeamScheduleTab;
