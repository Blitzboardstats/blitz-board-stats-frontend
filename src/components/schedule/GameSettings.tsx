
import React from 'react';
import { NewEventForm } from '@/types/eventTypes';

interface GameSettingsProps {
  newEvent: NewEventForm;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const GameSettings = ({ newEvent, onInputChange }: GameSettingsProps) => {
  if (newEvent.type !== 'Game') {
    return null;
  }

  // GameSettings now only handles game-specific notes or instructions
  // All other fields (opponent, duration, matchup format, end time) are handled in CreateEvent
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">
        Game Notes (Optional)
      </label>
      <textarea 
        name="notes"
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
        placeholder="Additional game notes or instructions..."
        value={newEvent.notes || ''}
        onChange={onInputChange}
        rows={3}
      />
    </div>
  );
};

export default GameSettings;
