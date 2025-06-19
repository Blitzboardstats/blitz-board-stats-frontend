
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { usePlayerEventRSVP, PlayerEventRSVP } from '@/hooks/usePlayerEventRSVP';
import { useAuth } from '@/contexts/AuthContextOptimized';
import BulkRSVPDialog from './BulkRSVPDialog';

interface PlayerRSVPListProps {
  eventId: string;
  eventTitle: string;
}

const PlayerRSVPList = ({ eventId, eventTitle }: PlayerRSVPListProps) => {
  const { isCoach } = useAuth();
  const { playerRSVPs, attendanceStats, isLoading, updatePlayerRSVP, isUpdating } = usePlayerEventRSVP(eventId);
  const [editingRSVP, setEditingRSVP] = useState<PlayerEventRSVP | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const getResponseColor = (response: string) => {
    switch(response) {
      case 'yes':
        return 'bg-green-600/20 text-green-400 border-green-800';
      case 'maybe':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-800';
      case 'no':
        return 'bg-red-600/20 text-red-400 border-red-800';
      case 'pending':
        return 'bg-gray-600/20 text-gray-400 border-gray-800';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-800';
    }
  };

  const getResponseText = (response: string) => {
    switch(response) {
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

  const handleResponseChange = (playerId: string, response: 'yes' | 'no' | 'maybe' | 'pending') => {
    updatePlayerRSVP({ playerId, response });
  };

  const handleEditRSVP = (rsvp: PlayerEventRSVP) => {
    setEditingRSVP(rsvp);
    setEditNotes(rsvp.notes || '');
  };

  const handleSaveNotes = () => {
    if (!editingRSVP) return;
    
    updatePlayerRSVP({ 
      playerId: editingRSVP.player_id, 
      response: editingRSVP.response,
      notes: editNotes.trim() || undefined
    });
    
    setEditingRSVP(null);
    setEditNotes('');
  };

  if (isLoading) {
    return (
      <Card className="bg-blitz-darkgray border border-gray-800">
        <CardContent className="p-4">
          <div className="animate-pulse">Loading player attendance...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-blitz-darkgray border border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          Player Attendance
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {attendanceStats.attending}/{attendanceStats.total} Going
            </Badge>
            <BulkRSVPDialog eventId={eventId} eventTitle={eventTitle} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* Attendance Summary */}
        <div className="grid grid-cols-4 gap-2 mb-4 text-center text-sm">
          <div className="bg-green-600/20 text-green-400 p-2 rounded">
            <div className="font-semibold">{attendanceStats.attending}</div>
            <div>Going</div>
          </div>
          <div className="bg-yellow-600/20 text-yellow-400 p-2 rounded">
            <div className="font-semibold">{attendanceStats.maybe}</div>
            <div>Maybe</div>
          </div>
          <div className="bg-red-600/20 text-red-400 p-2 rounded">
            <div className="font-semibold">{attendanceStats.notAttending}</div>
            <div>No</div>
          </div>
          <div className="bg-gray-600/20 text-gray-400 p-2 rounded">
            <div className="font-semibold">{attendanceStats.pending}</div>
            <div>Pending</div>
          </div>
        </div>

        {/* Player List */}
        <div className="space-y-2">
          {playerRSVPs.map((rsvp: PlayerEventRSVP) => (
            <div 
              key={rsvp.id} 
              className={`flex items-center justify-between p-3 border rounded-md ${getResponseColor(rsvp.response)}`}
            >
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
                      onClick={() => handleEditRSVP(rsvp)}
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
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Add notes about availability (e.g., 'Will be late', 'Minor injury', etc.)"
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setEditingRSVP(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveNotes} className="bg-blitz-purple hover:bg-blitz-purple/80">
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
                      onClick={() => handleResponseChange(rsvp.player_id, 'yes')}
                      disabled={isUpdating}
                    >
                      ✓
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs bg-yellow-600/20 text-yellow-400 border-yellow-800 hover:bg-yellow-600/30"
                      onClick={() => handleResponseChange(rsvp.player_id, 'maybe')}
                      disabled={isUpdating}
                    >
                      ?
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs bg-red-600/20 text-red-400 border-red-800 hover:bg-red-600/30"
                      onClick={() => handleResponseChange(rsvp.player_id, 'no')}
                      disabled={isUpdating}
                    >
                      ✗
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {playerRSVPs.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            No players found for this team.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerRSVPList;
