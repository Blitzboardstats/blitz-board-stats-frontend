
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { useBulkRSVP, PlayerInfo } from '@/hooks/useBulkRSVP';

interface BulkRSVPDialogProps {
  eventId: string;
  eventTitle: string;
}

const BulkRSVPDialog = ({ eventId, eventTitle }: BulkRSVPDialogProps) => {
  const [open, setOpen] = useState(false);
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [response, setResponse] = useState<'yes' | 'no' | 'maybe' | 'pending'>('yes');
  const [notes, setNotes] = useState('');
  
  const {
    selectedPlayers,
    togglePlayerSelection,
    selectAllPlayers,
    clearSelection,
    bulkRSVP,
    isBulkUpdating,
    getGuardianPlayers,
  } = useBulkRSVP(eventId);

  useEffect(() => {
    if (open) {
      loadPlayers();
    }
  }, [open]);

  const loadPlayers = async () => {
    const guardianPlayers = await getGuardianPlayers();
    setPlayers(guardianPlayers);
  };

  const handleSubmit = async () => {
    if (selectedPlayers.length === 0) return;

    await bulkRSVP({ 
      playerIds: selectedPlayers, 
      response, 
      notes: notes.trim() || undefined 
    });
    
    setOpen(false);
    setNotes('');
    clearSelection();
  };

  const getResponseColor = (responseType: string) => {
    switch(responseType) {
      case 'yes':
        return 'bg-green-600 hover:bg-green-700';
      case 'maybe':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'no':
        return 'bg-red-600 hover:bg-red-700';
      case 'pending':
        return 'bg-gray-600 hover:bg-gray-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getResponseText = (responseType: string) => {
    switch(responseType) {
      case 'yes':
        return 'Going';
      case 'maybe':
        return 'Maybe';
      case 'no':
        return 'Not Going';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          Bulk RSVP
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-blitz-darkgray border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">
            RSVP for Multiple Children
          </DialogTitle>
          <p className="text-gray-400 text-sm">{eventTitle}</p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Player Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-white font-medium">Select Children</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => selectAllPlayers(players.map(p => p.id))}
                  disabled={players.length === 0}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                  disabled={selectedPlayers.length === 0}
                >
                  Clear
                </Button>
              </div>
            </div>

            {players.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No children found. Make sure your email matches the guardian email on player profiles.
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center space-x-3 p-2 border border-gray-700 rounded-md"
                  >
                    <Checkbox
                      checked={selectedPlayers.includes(player.id)}
                      onCheckedChange={() => togglePlayerSelection(player.id)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      {player.jersey_number && (
                        <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-xs">
                          {player.jersey_number}
                        </Badge>
                      )}
                      <span className="text-white">{player.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Response Selection */}
          <div>
            <Label className="text-white font-medium mb-3 block">Response</Label>
            <div className="grid grid-cols-2 gap-2">
              {['yes', 'maybe', 'no', 'pending'].map((responseOption) => (
                <Button
                  key={responseOption}
                  type="button"
                  variant={response === responseOption ? 'default' : 'outline'}
                  size="sm"
                  className={response === responseOption ? getResponseColor(responseOption) : ''}
                  onClick={() => setResponse(responseOption as 'yes' | 'no' | 'maybe' | 'pending')}
                >
                  {getResponseText(responseOption)}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="bulk-notes" className="text-white font-medium mb-2 block">
              Notes (Optional)
            </Label>
            <Textarea
              id="bulk-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional information (e.g., 'Will be 15 minutes late', 'Minor injury concerns', etc.)"
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 resize-none"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isBulkUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedPlayers.length === 0 || isBulkUpdating}
              className={getResponseColor(response)}
            >
              {isBulkUpdating ? 'Updating...' : `RSVP ${selectedPlayers.length} Player${selectedPlayers.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkRSVPDialog;
