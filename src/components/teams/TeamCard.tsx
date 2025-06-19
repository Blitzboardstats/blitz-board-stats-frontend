
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Team } from '@/types/teamTypes';
import { UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TeamCardProps {
  team: Team & { playerCount?: number };
  onClick: () => void;
}

const TeamCard = ({ team, onClick }: TeamCardProps) => {
  return (
    <Card 
      className="bg-blitz-darkgray border border-gray-800 cursor-pointer hover:border-blitz-purple/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blitz-purple/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            {team.logo_url ? (
              <img 
                src={team.logo_url} 
                alt={`${team.name} logo`} 
                className="w-12 h-12 object-cover"
              />
            ) : team.photo_url ? (
              <img 
                src={team.photo_url} 
                alt={`${team.name} photo`} 
                className="w-12 h-12 object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-blitz-purple">
                {team.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{team.name}</h3>
              {team.age_group && (
                <Badge variant="ageGroup" className="text-sm font-medium">
                  {team.age_group}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center text-sm text-black">
                <UsersRound size={14} className="mr-1" />
                {team.playerCount || team.players?.length || 0} players
              </div>
              {team.football_type && (
                <Badge variant="outline" className="bg-blitz-purple/10 text-blitz-purple border-blitz-purple/25 text-xs">
                  {team.football_type}
                </Badge>
              )}
              {team.season && (
                <Badge variant="season" className="text-xs">
                  {team.season}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
