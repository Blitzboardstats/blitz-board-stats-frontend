
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EventTypeSelectorProps {
  value: 'Game' | 'Practice' | 'Tournament';
  onEventTypeChange: (type: 'Game' | 'Practice' | 'Tournament') => void;
}

const EventTypeSelector = ({ value, onEventTypeChange }: EventTypeSelectorProps) => {
  return (
    <div>
      <Label htmlFor="type" className="text-white">Event Type</Label>
      <Select value={value} onValueChange={onEventTypeChange}>
        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
          <SelectValue placeholder="Select event type" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="Game" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">Game</SelectItem>
          <SelectItem value="Practice" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">Practice</SelectItem>
          <SelectItem value="Tournament" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">Tournament</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EventTypeSelector;
