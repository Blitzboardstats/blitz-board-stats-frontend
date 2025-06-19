
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewEventForm } from '@/types/eventTypes';
import { Team } from '@/types/teamTypes';

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editEvent: NewEventForm;
  userTeams: Team[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEventTypeChange: (type: 'Game' | 'Practice' | 'Tournament') => void;
  onSave: (e: React.FormEvent) => void;
  isUpdating: boolean;
}

const EditEventDialog = ({
  open,
  onOpenChange,
  editEvent,
  userTeams,
  onInputChange,
  onEventTypeChange,
  onSave,
  isUpdating
}: EditEventDialogProps) => {
  const handleLocationChange = (location: string) => {
    const event = { target: { name: 'location', value: location } } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blitz-charcoal text-white border-gray-800 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSave} className="space-y-4">
          {/* Basic Info Section */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-300">Event Title</Label>
              <Input
                id="title"
                name="title"
                value={editEvent.title}
                onChange={onInputChange}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-sm font-medium text-gray-300">Event Type</Label>
              <Select value={editEvent.type} onValueChange={onEventTypeChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Game">Game</SelectItem>
                  <SelectItem value="Practice">Practice</SelectItem>
                  <SelectItem value="Tournament">Tournament</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="space-y-3 pt-2 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-300">Date & Time</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="date" className="text-xs text-gray-400">Start Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={editEvent.date}
                  onChange={onInputChange}
                  className="bg-gray-800 border-gray-700 text-white text-sm"
                  required
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-xs text-gray-400">Start Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={editEvent.time}
                  onChange={onInputChange}
                  className="bg-gray-800 border-gray-700 text-white text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="endTime" className="text-xs text-gray-400">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={editEvent.endTime || ''}
                onChange={onInputChange}
                className="bg-gray-800 border-gray-700 text-white text-sm"
              />
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-3 pt-2 border-t border-gray-700">
            <div>
              <Label htmlFor="location" className="text-sm font-medium text-gray-300">Location</Label>
              <Input
                id="location"
                name="location"
                value={editEvent.location}
                onChange={onInputChange}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="Enter location or venue"
                required
              />
            </div>
          </div>

          {/* Game-specific fields */}
          {editEvent.type === 'Game' && (
            <div className="space-y-3 pt-2 border-t border-gray-700">
              <h4 className="text-sm font-medium text-gray-300">Game Details</h4>
              <div>
                <Label htmlFor="opponent" className="text-xs text-gray-400">Opponent</Label>
                <Input
                  id="opponent"
                  name="opponent"
                  value={editEvent.opponent}
                  onChange={onInputChange}
                  className="bg-gray-800 border-gray-700 text-white text-sm"
                  placeholder="e.g. Lions"
                />
              </div>
            </div>
          )}

          {/* Team Selection */}
          <div className="pt-2 border-t border-gray-700">
            <Label htmlFor="teamId" className="text-sm font-medium text-gray-300">Team</Label>
            <Select value={editEvent.teamId} onValueChange={(value) => onInputChange({ target: { name: 'teamId', value } } as any)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {userTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blitz-purple hover:bg-blitz-purple/90 text-white"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
