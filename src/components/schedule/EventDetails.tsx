
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, Trash2, Clock } from 'lucide-react';
import { Event } from '@/types/eventTypes';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EventDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: Event | null;
  onRSVP: (response: 'yes' | 'no' | 'maybe') => void;
  onAddToCalendar: () => void;
  onDelete: (eventId: string) => void;
}

const EventDetails = ({
  open, 
  onOpenChange, 
  selectedEvent, 
  onRSVP, 
  onAddToCalendar, 
  onDelete
}: EventDetailsProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blitz-charcoal text-white border-gray-800">
        {selectedEvent && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">{selectedEvent.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <CalendarIcon size={18} className="text-[#00ff00] mr-2" />
                <span>{format(selectedEvent.date, 'EEEE, MMMM d')}</span>
              </div>
              
              <div className="flex items-center">
                <Clock size={18} className="text-[#00ff00] mr-2" />
                <span>
                  {selectedEvent.time}
                  {selectedEvent.endTime ? ` - ${selectedEvent.endTime}` : ''}
                </span>
              </div>
              
              {selectedEvent.type === 'Game' && selectedEvent.opponent && (
                <div className="text-gray-300">Opponent: {selectedEvent.opponent}</div>
              )}
              
              {selectedEvent.type === 'Tournament' && selectedEvent.teamCount && (
                <div className="text-gray-300">Number of Teams: {selectedEvent.teamCount}</div>
              )}
              
              <div className="text-gray-300 flex items-center">
                <MapPin size={18} className="text-[#00ff00] mr-2" /> 
                {selectedEvent.location}
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <div className="text-sm font-medium mb-2">RSVP to this event:</div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-green-600/20 text-green-400 border-green-800 hover:bg-green-600/30"
                    onClick={() => onRSVP('yes')}
                  >
                    Going
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-yellow-600/20 text-yellow-400 border-yellow-800 hover:bg-yellow-600/30"
                    onClick={() => onRSVP('maybe')}
                  >
                    Maybe
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-red-600/20 text-red-400 border-red-800 hover:bg-red-600/30"
                    onClick={() => onRSVP('no')}
                  >
                    No
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-blitz-purple hover:bg-blitz-purple/90"
                  onClick={onAddToCalendar}
                >
                  Add to Phone Calendar
                </Button>
                
                <Button 
                  variant="outline"
                  className="bg-red-600/20 text-red-400 border-red-800 hover:bg-red-600/30"
                  onClick={() => onDelete(selectedEvent.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventDetails;
