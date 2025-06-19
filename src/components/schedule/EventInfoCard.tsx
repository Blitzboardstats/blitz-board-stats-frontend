
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, Clock, Users, StickyNote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types/eventTypes';
import { parseEventDate } from '@/utils/dateUtils';

interface EventInfoCardProps {
  event: Event;
}

const EventInfoCard = ({ event }: EventInfoCardProps) => {
  // Format time to 12-hour format with AM/PM
  const formatTimeToStandard = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Check if this is a multi-team event
  const isMultiTeam = event.eventTeams && event.eventTeams.length > 0;

  return (
    <Card className="bg-blitz-darkgray border-gray-700 mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl text-black mb-2">{event.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-blitz-purple border-blitz-purple">
                {event.type}
              </Badge>
              {isMultiTeam && (
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  <Users className="w-3 h-3 mr-1" />
                  Multi-Team
                </Badge>
              )}
              {event.ageGroups && event.ageGroups.length > 0 && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {event.ageGroups.join(', ')}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-black">
            <CalendarIcon className="w-5 h-5 text-blitz-green mr-3" />
            <span>{format(parseEventDate(event.date), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center text-black">
            <Clock className="w-5 h-5 text-blitz-green mr-3" />
            <span>
              {formatTimeToStandard(event.time)}
              {event.endTime && ` - ${formatTimeToStandard(event.endTime)}`}
            </span>
          </div>
          
          <div className="flex items-start text-black">
            <MapPin className="w-5 h-5 text-blitz-green mr-3 mt-0.5" />
            <span>{event.location}</span>
          </div>

          {event.opponent && (
            <div className="text-black">
              <span className="font-medium">Opponent:</span> {event.opponent}
            </div>
          )}

          {event.notes && (
            <div className="flex items-start text-black">
              <StickyNote className="w-5 h-5 text-blitz-green mr-3 mt-0.5" />
              <div className="bg-gray-800/50 p-3 rounded flex-1">
                <span className="font-medium">Notes:</span>
                <div className="mt-1 text-sm">{event.notes}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventInfoCard;
