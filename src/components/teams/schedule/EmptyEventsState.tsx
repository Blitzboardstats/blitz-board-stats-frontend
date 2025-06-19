
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Plus } from 'lucide-react';

interface EmptyEventsStateProps {
  canManageTeam: boolean;
  isCreating: boolean;
  onCreateEvent: () => void;
}

const EmptyEventsState = ({ canManageTeam, isCreating, onCreateEvent }: EmptyEventsStateProps) => {
  return (
    <Card className="bg-blitz-darkgray border border-gray-800">
      <CardContent className="p-8 text-center">
        <CalendarIcon size={64} className="text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">No events scheduled</h3>
        <p className="text-black mb-6">This team doesn't have any events scheduled yet.</p>
        {canManageTeam && (
          <Button 
            onClick={onCreateEvent}
            className="bg-blitz-purple hover:bg-blitz-purple/90 text-white"
            disabled={isCreating}
          >
            <Plus size={16} className="mr-1" />
            Create First Event
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyEventsState;
