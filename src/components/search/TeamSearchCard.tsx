
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Team {
  id: string;
  name: string;
  football_type: string;
  age_group?: string;
  season?: string;
  coach_id: string;
  created_by: string;
  photo_url?: string;
  created_at: string;
}

interface TeamSearchCardProps {
  team: Team;
  isJoined: boolean;
  isOwnTeam: boolean;
  onJoinTeam: (teamId: string) => void;
  onViewTeam: (teamId: string) => void;
}

const TeamSearchCard = ({ team, isJoined, isOwnTeam, onJoinTeam, onViewTeam }: TeamSearchCardProps) => {
  const handleJoinClick = () => onJoinTeam(team.id);
  const handleViewClick = () => onViewTeam(team.id);

  return (
    <Card className="blitz-card">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-white mb-1">{team.name}</h3>
            <p className="text-sm text-gray-400">{team.football_type}</p>
            {team.age_group && (
              <p className="text-sm text-gray-400">Age Group: {team.age_group}</p>
            )}
            {team.season && (
              <p className="text-sm text-gray-400">Season: {team.season}</p>
            )}
          </div>
          
          <div className="flex flex-col space-y-2">
            {isOwnTeam ? (
              <Button
                onClick={handleViewClick}
                variant="outline"
                size="sm"
                className="border-blitz-purple text-blitz-purple hover:bg-blitz-purple hover:text-white"
              >
                Manage
              </Button>
            ) : isJoined ? (
              <Button
                onClick={handleViewClick}
                variant="outline"
                size="sm"
                className="border-blitz-green text-blitz-green hover:bg-blitz-green hover:text-white"
              >
                View Team
              </Button>
            ) : (
              <Button
                onClick={handleJoinClick}
                size="sm"
                className="bg-blitz-purple hover:bg-blitz-purple/90"
              >
                Join Team
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamSearchCard;
