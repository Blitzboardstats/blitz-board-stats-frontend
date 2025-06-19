
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePlayerEventRSVP } from '@/hooks/usePlayerEventRSVP';
import { useAuth } from '@/contexts/AuthContextOptimized';
import TeamRSVPGroup from './TeamRSVPGroup';
import BulkRSVPDialog from './BulkRSVPDialog';

interface EnhancedPlayerRSVPListProps {
  eventId: string;
  eventTitle: string;
}

const EnhancedPlayerRSVPList = ({ eventId, eventTitle }: EnhancedPlayerRSVPListProps) => {
  const { isCoach } = useAuth();
  const { playerRSVPs, attendanceStats, isLoading, updatePlayerRSVP, bulkUpdatePlayerRSVP, isUpdating } = usePlayerEventRSVP(eventId);
  const [editingRSVP, setEditingRSVP] = useState(null);
  const [editNotes, setEditNotes] = useState('');

  const handleEditRSVP = (rsvp: any) => {
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

  const handleCancelEdit = () => {
    setEditingRSVP(null);
    setEditNotes('');
  };

  const handleResponseChange = (playerId: string, response: 'yes' | 'no' | 'maybe' | 'pending') => {
    updatePlayerRSVP({ playerId, response });
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

  // Group RSVPs by team for multi-team events
  const rsvpsByTeam = playerRSVPs.reduce((teams, rsvp) => {
    const teamName = rsvp.team_name || 'Unknown Team';
    if (!teams[teamName]) {
      teams[teamName] = [];
    }
    teams[teamName].push(rsvp);
    return teams;
  }, {} as Record<string, any[]>);

  const teamNames = Object.keys(rsvpsByTeam);
  const isMultiTeam = teamNames.length > 1;

  // Consolidate maybe and pending into one "pending" count
  const consolidatedPending = attendanceStats.maybe + attendanceStats.pending;

  return (
    <Card className="bg-blitz-darkgray border border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          Player Attendance {isMultiTeam && <Badge variant="outline" className="text-xs">Multi-Team</Badge>}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {attendanceStats.attending}/{attendanceStats.total} Committed
            </Badge>
            <BulkRSVPDialog eventId={eventId} eventTitle={eventTitle} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* Overall Attendance Summary - Only 3 categories now */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
          <div className="bg-blitz-green/20 text-blitz-green p-2 rounded">
            <div className="font-semibold">{attendanceStats.attending}</div>
            <div>Committed</div>
          </div>
          <div className="bg-blue-600/30 text-blue-400 p-2 rounded">
            <div className="font-semibold">{consolidatedPending}</div>
            <div>Pending</div>
          </div>
          <div className="bg-red-600/20 text-red-400 p-2 rounded">
            <div className="font-semibold">{attendanceStats.notAttending}</div>
            <div>No</div>
          </div>
        </div>

        {/* Team-by-Team Breakdown for Multi-Team Events */}
        {isMultiTeam && (
          <div className="mb-4 p-3 bg-blue-900/20 border border-blue-800 rounded">
            <h4 className="font-medium text-blue-400 mb-2">Team Breakdown:</h4>
            <div className="grid gap-2 text-sm">
              {Object.entries(attendanceStats.byTeam).map(([teamName, stats]) => {
                const teamPending = stats.maybe + stats.pending;
                return (
                  <div key={teamName} className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="font-medium">{teamName}</span>
                    <div className="flex gap-3 text-xs">
                      <span className="text-blitz-green">{stats.attending} Committed</span>
                      <span className="text-blue-400">{teamPending} Pending</span>
                      <span className="text-red-400">{stats.notAttending} No</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Player List - Grouped by Team for Multi-Team Events */}
        <div className="space-y-4">
          {teamNames.map((teamName) => (
            <TeamRSVPGroup
              key={teamName}
              teamName={teamName}
              teamPlayers={rsvpsByTeam[teamName]}
              isMultiTeam={isMultiTeam}
              isCoach={isCoach}
              editingRSVP={editingRSVP}
              editNotes={editNotes}
              isUpdating={isUpdating}
              onEditRSVP={handleEditRSVP}
              onSaveNotes={handleSaveNotes}
              onCancelEdit={handleCancelEdit}
              onNotesChange={setEditNotes}
              onResponseChange={handleResponseChange}
            />
          ))}
        </div>

        {playerRSVPs.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            No players found for this event.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedPlayerRSVPList;
