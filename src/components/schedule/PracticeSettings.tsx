
import React from 'react';
import { NewEventForm } from '@/types/eventTypes';

interface PracticeSettingsProps {
  newEvent: NewEventForm;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const PracticeSettings = ({ newEvent, onInputChange }: PracticeSettingsProps) => {
  if (newEvent.type !== 'Practice') {
    return null;
  }

  // PracticeSettings now only handles practice-specific fields
  // End time is handled in the main CreateEvent component
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">
        Practice Notes (Optional)
      </label>
      <textarea 
        name="notes"
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
        placeholder="Practice agenda, equipment needed, etc..."
        value={newEvent.notes || ''}
        onChange={onInputChange}
        rows={3}
      />
    </div>
  );
};

export default PracticeSettings;
