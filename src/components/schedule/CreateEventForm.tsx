
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NewEventForm } from '@/types/eventTypes';
import { Team } from '@/types/teamTypes';
import EventTypeSelector from './EventTypeSelector';
import EventBasicFields from './EventBasicFields';
import GameSpecificFields from './GameSpecificFields';
import GameSettings from './GameSettings';
import PracticeSettings from './PracticeSettings';
import TournamentSettings from './TournamentSettings';

interface CreateEventFormProps {
  newEvent: NewEventForm;
  userTeams: Team[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEventTypeChange: (type: 'Game' | 'Practice' | 'Tournament') => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  isCreating: boolean;
}

const CreateEventForm = ({
  newEvent,
  userTeams,
  onInputChange,
  onEventTypeChange,
  onSave,
  onCancel,
  isCreating
}: CreateEventFormProps) => {
  const [endDate, setEndDate] = useState<Date | undefined>(
    newEvent.endDate ? new Date(newEvent.endDate) : undefined
  );
  const [isAllDay, setIsAllDay] = useState(false);

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    const event = { 
      target: { 
        name: 'endDate', 
        value: date ? date.toISOString().split('T')[0] : '' 
      } 
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);
  };

  const handleAgeGroupsChange = (ageGroups: string[]) => {
    const event = { 
      target: { 
        name: 'ageGroups', 
        value: ageGroups 
      } 
    } as any;
    onInputChange(event);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For tournaments, ensure end date is provided
    if (newEvent.type === 'Tournament' && !endDate) {
      alert('End date is required for tournaments');
      return;
    }
    
    onSave(e);
  };

  // Determine if end time should be shown
  const shouldShowEndTime = () => {
    if (newEvent.type === 'Tournament' && isAllDay) return false;
    return true;
  };

  // Determine if start time should be shown
  const shouldShowStartTime = () => {
    if (newEvent.type === 'Tournament' && isAllDay) return false;
    return true;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <EventTypeSelector 
        value={newEvent.type}
        onEventTypeChange={onEventTypeChange}
      />

      <EventBasicFields
        newEvent={newEvent}
        userTeams={userTeams}
        onInputChange={onInputChange}
        shouldShowStartTime={shouldShowStartTime()}
        shouldShowEndTime={shouldShowEndTime()}
      />

      <GameSpecificFields 
        newEvent={newEvent}
        onInputChange={onInputChange}
        shouldShowStartTime={shouldShowStartTime()}
      />

      <GameSettings 
        newEvent={newEvent} 
        onInputChange={onInputChange} 
      />

      <PracticeSettings 
        newEvent={newEvent} 
        onInputChange={onInputChange} 
      />

      <TournamentSettings 
        newEvent={newEvent} 
        onInputChange={onInputChange}
        availableAgeGroups={['U6', 'U8', 'U10', 'U12', 'U14', 'U16', 'U18']}
        selectedAgeGroups={newEvent.ageGroups || []}
        onAgeGroupsChange={handleAgeGroupsChange}
        endDate={endDate}
        setEndDate={handleEndDateChange}
        isAllDay={isAllDay}
        setIsAllDay={setIsAllDay}
      />

      <div className="flex gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1 bg-blitz-green border-blitz-green text-white hover:bg-blitz-green/90"
          disabled={isCreating}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-blitz-purple hover:bg-blitz-purple/90 text-white"
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};

export default CreateEventForm;
