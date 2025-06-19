
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TeamCoach } from '@/types/teamTypes';
import { Player } from '@/types/playerTypes';

interface CoachGuardianIndicatorProps {
  coach: TeamCoach;
  players: Player[];
}

const CoachGuardianIndicator = ({ coach, players }: CoachGuardianIndicatorProps) => {
  if (!coach.email) return null;

  // Find players where this coach is the guardian
  const guardianFor = players.filter(player => 
    player.guardian_email?.toLowerCase() === coach.email?.toLowerCase()
  );

  if (guardianFor.length === 0) return null;

  return (
    <div className="mt-2">
      <Badge variant="outline" className="bg-green-500/20 border-green-500 text-black text-xs">
        Guardian for {guardianFor.length} player{guardianFor.length > 1 ? 's' : ''}
      </Badge>
      <div className="text-xs text-gray-400 mt-1">
        {guardianFor.map(player => player.name).join(', ')}
      </div>
    </div>
  );
};

export default CoachGuardianIndicator;
