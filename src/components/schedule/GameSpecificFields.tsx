
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { NewEventForm } from '@/types/eventTypes';

interface GameSpecificFieldsProps {
  newEvent: NewEventForm;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  shouldShowStartTime?: boolean;
}

const GameSpecificFields = ({ newEvent, onInputChange }: GameSpecificFieldsProps) => {
  if (newEvent.type !== 'Game') {
    return null;
  }

  return (
    <>
      <div>
        <Label htmlFor="duration" className="text-white">Game Duration (minutes)</Label>
        <Select value={newEvent.duration?.toString() || ''} onValueChange={(value) => onInputChange({ target: { name: 'duration', value } } as any)}>
          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="40" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">40 minutes</SelectItem>
            <SelectItem value="48" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">48 minutes</SelectItem>
            <SelectItem value="50" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">50 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="matchupFormat" className="text-white">Matchup Format</Label>
        <Select value={newEvent.matchupFormat || ''} onValueChange={(value) => onInputChange({ target: { name: 'matchupFormat', value } } as any)}>
          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="Halves" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">Halves</SelectItem>
            <SelectItem value="Quarters" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">Quarters</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default GameSpecificFields;
