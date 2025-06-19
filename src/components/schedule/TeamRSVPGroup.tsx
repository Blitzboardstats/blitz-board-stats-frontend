
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PlayerEventRSVP } from '@/hooks/usePlayerEventRSVP';
import PlayerRSVPItem from './PlayerRSVPItem';

interface TeamRSVPGroupProps {
  teamName: string;
  teamPlayers: PlayerEventRSVP[];
  isMultiTeam: boolean;
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

const TeamRSVPGroup = ({
  teamName,
  teamPlayers,
  isMultiTeam,
  isCoach,
  editingRSVP,
  editNotes,
  isUpdating,
  onEditRSVP,
  onSaveNotes,
  onCancelEdit,
  onNotesChange,
  onResponseChange
}: TeamRSVPGroupProps) => {
  return (
    <div>
      {isMultiTeam && (
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-sm font-medium text-gray-300">{teamName}</h4>
          <Badge variant="outline" className="text-xs">
            {teamPlayers.length} players
          </Badge>
        </div>
      )}
      
      <div className="space-y-2">
        {teamPlayers.map((rsvp: PlayerEventRSVP) => (
          <PlayerRSVPItem
            key={rsvp.id}
            rsvp={rsvp}
            isCoach={isCoach}
            editingRSVP={editingRSVP}
            editNotes={editNotes}
            isUpdating={isUpdating}
            onEditRSVP={onEditRSVP}
            onSaveNotes={onSaveNotes}
            onCancelEdit={onCancelEdit}
            onNotesChange={onNotesChange}
            onResponseChange={onResponseChange}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamRSVPGroup;
