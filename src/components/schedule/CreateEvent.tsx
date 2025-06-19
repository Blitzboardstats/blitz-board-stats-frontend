
import React from 'react';
import { NewEventForm } from '@/types/eventTypes';
import { Team } from '@/types/teamTypes';
import CreateEventDialog from './CreateEventDialog';

interface CreateEventProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newEvent: NewEventForm;
  userTeams: Team[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEventTypeChange: (type: 'Game' | 'Practice' | 'Tournament') => void;
  onSave: (e: React.FormEvent) => void;
  isCreating: boolean;
}

const CreateEvent = (props: CreateEventProps) => {
  return <CreateEventDialog {...props} />;
};

export default CreateEvent;
