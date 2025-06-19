
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { NewEventForm } from '@/types/eventTypes';
import CreateEvent from '@/components/schedule/CreateEvent';

interface SimpleTeam {
  id: string;
  name: string;
  age_group?: string;
}

interface CreateEventSectionProps {
  canManageTeam: boolean;
  teamId: string;
  selectedDate: Date | undefined;
  showCreateEvent: boolean;
  setShowCreateEvent: (show: boolean) => void;
  newEvent: NewEventForm;
  setNewEvent: (event: NewEventForm) => void;
  userTeams: SimpleTeam[];
  isCreating: boolean;
  onCreateEvent: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onEventTypeChange: (type: 'Game' | 'Practice' | 'Tournament') => void;
  onSaveEvent: (e: React.FormEvent) => void;
}

const CreateEventSection = ({
  canManageTeam,
  teamId,
  selectedDate,
  showCreateEvent,
  setShowCreateEvent,
  newEvent,
  setNewEvent,
  userTeams,
  isCreating,
  onCreateEvent,
  onInputChange,
  onEventTypeChange,
  onSaveEvent,
}: CreateEventSectionProps) => {
  console.log('CreateEventSection - canManageTeam:', canManageTeam, 'teamId:', teamId);
  
  // Only show the button if user can manage the team
  if (!canManageTeam) {
    console.log('CreateEventSection - User cannot manage team, hiding button');
    return null;
  }
  
  const handleCreateEvent = () => {
    setNewEvent({
      ...newEvent,
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      teamId: teamId,
      endDate: '',
      prizeDetails: '',
      registrationFee: '',
    });
    onCreateEvent();
  };

  // Convert userTeams to full Team objects for the CreateEvent component
  const fullUserTeams = userTeams.map(team => ({
    id: team.id,
    name: team.name,
    age_group: team.age_group,
    football_type: 'Flag' as const,
    coach_id: '',
    created_by: '',
    created_at: '',
    wins: 0,
    losses: 0,
    draws: 0
  }));

  return (
    <>
      <Button 
        onClick={handleCreateEvent}
        size="sm"
        className="bg-blitz-purple hover:bg-blitz-purple/90 text-white"
        disabled={isCreating}
      >
        <Plus size={16} className="mr-1" />
        Add Event
      </Button>

      <CreateEvent 
        open={showCreateEvent}
        onOpenChange={setShowCreateEvent}
        newEvent={newEvent}
        userTeams={fullUserTeams}
        onInputChange={onInputChange}
        onEventTypeChange={onEventTypeChange}
        onSave={onSaveEvent}
        isCreating={isCreating}
      />
    </>
  );
};

export default CreateEventSection;
