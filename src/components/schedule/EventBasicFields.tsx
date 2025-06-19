
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewEventForm } from '@/types/eventTypes';
import { Team } from '@/types/teamTypes';
import LocationSearchField from './LocationSearchField';

interface EventBasicFieldsProps {
  newEvent: NewEventForm;
  userTeams: Team[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  shouldShowStartTime: boolean;
  shouldShowEndTime: boolean;
}

const EventBasicFields = ({
  newEvent,
  userTeams,
  onInputChange,
  shouldShowStartTime,
  shouldShowEndTime
}: EventBasicFieldsProps) => {
  return (
    <>
      {/* Event Title - Only show for non-Game events */}
      {newEvent.type !== 'Game' && (
        <div>
          <Label htmlFor="title" className="text-white">
            {newEvent.type === 'Tournament' ? 'Tournament Name' : 'Event Title'}
          </Label>
          <Input
            id="title"
            name="title"
            value={newEvent.title}
            onChange={onInputChange}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            placeholder={
              newEvent.type === 'Tournament' 
                ? 'e.g. State Championship'
                : newEvent.type === 'Practice'
                ? 'Team Practice'
                : 'Event title'
            }
            required
          />
        </div>
      )}

      {/* Home Team Selection - Show first for Game events */}
      {newEvent.type === 'Game' && (
        <div>
          <Label htmlFor="teamId" className="text-white">Home Team</Label>
          <Select value={newEvent.teamId} onValueChange={(value) => onInputChange({ target: { name: 'teamId', value } } as any)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select home team" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {userTeams.map((team) => (
                <SelectItem key={team.id} value={team.id} className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Away Team - Show directly after Home Team for Game events */}
      {newEvent.type === 'Game' && (
        <div>
          <Label htmlFor="opponent" className="text-white">Away Team</Label>
          <Input
            id="opponent"
            name="opponent"
            value={newEvent.opponent}
            onChange={onInputChange}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            placeholder="e.g. Lions"
            required
          />
        </div>
      )}

      {/* Start Date */}
      <div>
        <Label htmlFor="date" className="text-white">Start Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={newEvent.date}
          onChange={onInputChange}
          className="bg-gray-800 border-gray-700 text-white"
          required
        />
      </div>

      {/* Start Time - Show directly after Start Date */}
      {shouldShowStartTime && (
        <div>
          <Label htmlFor="time" className="text-white">Start Time</Label>
          <Input
            id="time"
            name="time"
            type="time"
            value={newEvent.time}
            onChange={onInputChange}
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>
      )}

      {/* End Time */}
      {shouldShowEndTime && (
        <div>
          <Label htmlFor="endTime" className="text-white">End Time</Label>
          <Input
            id="endTime"
            name="endTime"
            type="time"
            value={newEvent.endTime || ''}
            onChange={onInputChange}
            className="bg-gray-800 border-gray-700 text-white"
            required={newEvent.type !== 'Tournament'}
          />
        </div>
      )}

      {/* Location */}
      <LocationSearchField
        value={newEvent.location}
        onInputChange={onInputChange}
      />

      {/* Team Selection - Only show for non-Game events */}
      {newEvent.type !== 'Game' && (
        <div>
          <Label htmlFor="teamId" className="text-white">Team</Label>
          <Select value={newEvent.teamId} onValueChange={(value) => onInputChange({ target: { name: 'teamId', value } } as any)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {userTeams.map((team) => (
                <SelectItem key={team.id} value={team.id} className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};

export default EventBasicFields;
