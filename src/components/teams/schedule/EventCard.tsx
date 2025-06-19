
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CalendarIcon, Clock, MapPin, Edit, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '@/types/eventTypes';
import { parseEventDate } from '@/utils/dateUtils';

interface EventCardProps {
  event: Event;
  teamId: string;
  onEventClick: (event: Event) => void;
  canManageTeam?: boolean;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (event: Event) => void;
}

const EventCard = ({ 
  event, 
  teamId, 
  onEventClick, 
  canManageTeam = false,
  onEditEvent,
  onDeleteEvent 
}: EventCardProps) => {
  const getBadgeVariant = (type: 'Game' | 'Practice' | 'Tournament') => {
    switch(type) {
      case 'Game':
        return 'game';
      case 'Practice':
        return 'practice';
      case 'Tournament':
        return 'default';
      default:
        return 'default';
    }
  };

  // Parse the event date safely to avoid timezone issues
  const eventDate = parseEventDate(event.date);

  const handleEditClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onEditEvent) {
      onEditEvent(event);
    }
  };

  const handleDeleteClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onDeleteEvent) {
      onDeleteEvent(event);
    }
  };

  return (
    <Card 
      className="bg-blitz-darkgray border border-gray-800 cursor-pointer hover:border-blitz-purple/50 transition-colors"
      onClick={() => onEventClick(event)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Badge 
              variant={getBadgeVariant(event.type)}
              className={event.type === 'Tournament' ? 'bg-blue-500 hover:bg-blue-600' : ''}
            >
              {event.type}
            </Badge>
            <h3 className="font-semibold text-white">{event.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {event.type === 'Game' && event.opponent && (
              <div className="text-sm bg-blitz-charcoal py-1 px-2 rounded text-black">
                vs. {event.opponent}
              </div>
            )}
            {event.type === 'Tournament' && event.teamId !== teamId && (
              <div className="text-xs bg-blue-500 text-white py-1 px-2 rounded">
                Age Group Event
              </div>
            )}
            {canManageTeam && event.teamId === teamId && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="h-6 w-6 p-0 hover:bg-blitz-purple/20 text-gray-400 hover:text-white"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-gray-800 border-gray-700 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem 
                    onClick={handleEditClick}
                    className="text-white hover:bg-blitz-purple/20 focus:bg-blitz-purple/20 cursor-pointer"
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Edit Event
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDeleteClick}
                    className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete Event
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        <div className="space-y-1 text-sm text-gray-400">
          <div className="flex items-center">
            <CalendarIcon size={14} className="mr-2" /> 
            {format(eventDate, 'EEEE, MMMM d, yyyy')}
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-2" />
            {event.time}
            {event.endTime ? ` - ${event.endTime}` : ''}
          </div>
          <div className="flex items-center">
            <MapPin size={14} className="mr-2 text-blitz-purple" /> 
            {event.location}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
