
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { NewEventForm } from '@/types/eventTypes';
import AgeGroupSelector from './AgeGroupSelector';

interface TournamentSettingsProps {
  newEvent: NewEventForm;
  availableAgeGroups: string[];
  selectedAgeGroups: string[];
  onAgeGroupsChange: (ageGroups: string[]) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  isAllDay: boolean;
  setIsAllDay: (isAllDay: boolean) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const TournamentSettings = ({
  newEvent,
  availableAgeGroups,
  selectedAgeGroups,
  onAgeGroupsChange,
  endDate,
  setEndDate,
  isAllDay,
  setIsAllDay,
  onInputChange
}: TournamentSettingsProps) => {
  const handleAllDayChange = (checked: boolean) => {
    setIsAllDay(checked);
    if (checked) {
      // Set default times for all-day events
      const startTimeEvent = {
        target: { name: 'time', value: '00:00' }
      } as React.ChangeEvent<HTMLInputElement>;
      const endTimeEvent = {
        target: { name: 'endTime', value: '23:59' }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(startTimeEvent);
      onInputChange(endTimeEvent);
    }
  };

  if (newEvent.type !== 'Tournament') {
    return null;
  }

  return (
    <>
      {/* Age Group Selector - only for tournaments */}
      {availableAgeGroups.length > 0 && (
        <AgeGroupSelector
          selectedAgeGroups={selectedAgeGroups}
          onAgeGroupsChange={onAgeGroupsChange}
          availableAgeGroups={availableAgeGroups}
        />
      )}

      {/* Tournament All Day Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="allDay"
          checked={isAllDay}
          onCheckedChange={handleAllDayChange}
          className="border-gray-500 data-[state=checked]:bg-[#00ff00] data-[state=checked]:text-black"
        />
        <label htmlFor="allDay" className="text-sm font-medium text-gray-300">
          All Day Tournament
        </label>
      </div>

      {/* Tournament end date */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          End Date *
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white",
                !endDate && "text-gray-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Tournament-specific fields */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Number of Teams (Optional)
        </label>
        <input 
          type="number" 
          name="teamCount"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm" 
          placeholder="e.g. 8"
          value={newEvent.teamCount || ''}
          onChange={onInputChange}
          min="2"
        />
      </div>

      {/* Tournament Prize Details */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Prize Details (Optional)
        </label>
        <input 
          type="text" 
          name="prizeDetails"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm" 
          placeholder="e.g. Trophy and medals"
          value={newEvent.prizeDetails || ''}
          onChange={onInputChange}
        />
      </div>

      {/* Tournament Registration Fee */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Registration Fee (Optional)
        </label>
        <input 
          type="text" 
          name="registrationFee"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm" 
          placeholder="e.g. $25 per team"
          value={newEvent.registrationFee || ''}
          onChange={onInputChange}
        />
      </div>

      {/* Tournament Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Tournament Notes (Optional)
        </label>
        <textarea 
          name="notes"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
          placeholder="Tournament rules, schedule details, etc..."
          value={newEvent.notes || ''}
          onChange={onInputChange}
          rows={3}
        />
      </div>
    </>
  );
};

export default TournamentSettings;
