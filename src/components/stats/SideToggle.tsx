
import React from 'react';
import { Button } from '@/components/ui/button';

interface SideToggleProps {
  selectedSide: 'offense' | 'defense';
  setSelectedSide: (side: 'offense' | 'defense') => void;
  canEdit: boolean;
}

export const SideToggle = ({ selectedSide, setSelectedSide, canEdit }: SideToggleProps) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-sm font-medium ${selectedSide === 'offense' ? 'text-purple-400' : 'text-gray-500'}`}>
          Offense
        </span>
        <div className="relative">
          <Button
            className={`w-16 h-8 rounded-full relative transition-all ${
              selectedSide === 'offense' ? 'bg-purple-600' : 'bg-green-600'
            } hover:opacity-80`}
            onClick={() => setSelectedSide(selectedSide === 'offense' ? 'defense' : 'offense')}
            disabled={!canEdit}
          >
            <div 
              className={`w-6 h-6 bg-white rounded-full absolute transition-transform duration-200 ${
                selectedSide === 'offense' ? 'translate-x-[-12px]' : 'translate-x-[12px]'
              }`} 
            />
          </Button>
        </div>
        <span className={`text-sm font-medium ${selectedSide === 'defense' ? 'text-green-400' : 'text-gray-500'}`}>
          Defense
        </span>
      </div>
    </div>
  );
};
