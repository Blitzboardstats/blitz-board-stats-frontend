
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlayerEventRSVP } from '@/hooks/usePlayerEventRSVP';
import { getResponseColor, getResponseText } from '@/utils/rsvpUtils';

interface PlayerRSVPItemProps {
  rsvp: PlayerEventRSVP;
  isCoach: boolean;
  editingRSVP: PlayerEventRSVP | null;
  editNotes: string;
  isUpdating: boolean;
  onEditRSVP: (rsvp: PlayerEventRSVP) => void;
  onSaveNotes: () => void;
  onCancelEdit: () => void;
  onNotesChange: (notes: string) => void;
  onResponseChange: (playerId: string, response: 'yes' | 'no' | 'maybe' | 'pending') => void;
}

const PlayerRSVPItem = ({
  rsvp,
  isCoach,
  editingRSVP,
  editNotes,
  isUpdating,
  onEditRSVP,
  onSaveNotes,
  onCancelEdit,
  onNotesChange,
  onResponseChange
}: PlayerRSVPItemProps) => {
  return (
    <div className={`flex items-center justify-between p-3 border rounded-md ${getResponseColor(rsvp.response)}`}>
      <div className="flex items-center gap-3">
        {rsvp.jersey_number && (
          <div className="bg-blitz-purple text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
            {rsvp.jersey_number}
          </div>
        )}
        <div>
          <span className="font-medium">{rsvp.player_name}</span>
          {rsvp.notes && (
            <p className="text-xs opacity-75 mt-1">"{rsvp.notes}"</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Badge 
              variant="outline" 
              className={`cursor-pointer ${getResponseColor(rsvp.response)}`}
              onClick={() => onEditRSVP(rsvp)}
            >
              {getResponseText(rsvp.response)}
            </Badge>
          </DialogTrigger>
          <DialogContent className="bg-blitz-darkgray border border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white">
                Edit RSVP for {rsvp.player_name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white font-medium mb-2 block">Notes</Label>
                <Textarea
                  value={editNotes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  placeholder="Add notes about availability (e.g., 'Will be late', 'Minor injury', etc.)"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onCancelEdit}>
                  Cancel
                </Button>
                <Button onClick={onSaveNotes} className="bg-blitz-purple hover:bg-blitz-purple/80">
                  Save Notes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {isCoach && (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-6 px-2 text-xs bg-green-600/20 text-green-400 border-green-800 hover:bg-green-600/30"
              onClick={() => onResponseChange(rsvp.player_id, 'yes')}
              disabled={isUpdating}
            >
              ✓
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-6 px-2 text-xs bg-yellow-600/20 text-yellow-400 border-yellow-800 hover:bg-yellow-600/30"
              onClick={() => onResponseChange(rsvp.player_id, 'maybe')}
              disabled={isUpdating}
            >
              ?
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-6 px-2 text-xs bg-red-600/20 text-red-400 border-red-800 hover:bg-red-600/30"
              onClick={() => onResponseChange(rsvp.player_id, 'no')}
              disabled={isUpdating}
            >
              ✗
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerRSVPItem;
