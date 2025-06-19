
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NewEventForm } from '@/types/eventTypes';
import { Team } from '@/types/teamTypes';
import CreateEventForm from './CreateEventForm';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newEvent: NewEventForm;
  userTeams: Team[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEventTypeChange: (type: 'Game' | 'Practice' | 'Tournament') => void;
  onSave: (e: React.FormEvent) => void;
  isCreating: boolean;
}

const CreateEventDialog = ({
  open,
  onOpenChange,
  newEvent,
  userTeams,
  onInputChange,
  onEventTypeChange,
  onSave,
  isCreating
}: CreateEventDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blitz-charcoal text-white border-gray-800 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Event</DialogTitle>
        </DialogHeader>
        
        <CreateEventForm
          newEvent={newEvent}
          userTeams={userTeams}
          onInputChange={onInputChange}
          onEventTypeChange={onEventTypeChange}
          onSave={onSave}
          onCancel={() => onOpenChange(false)}
          isCreating={isCreating}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
