
import React from 'react';
import TeamSearchCard from './TeamSearchCard';

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

interface TeamSearchResultsProps {
  teams: Team[];
  joinedTeams: string[];
  currentUserId: string | undefined;
  onJoinTeam: (teamId: string) => void;
  onViewTeam: (teamId: string) => void;
}

const TeamSearchResults = ({ 
  teams, 
  joinedTeams, 
  currentUserId, 
  onJoinTeam, 
  onViewTeam 
}: TeamSearchResultsProps) => {
  return (
    <div className="space-y-4">
      {teams.map((team) => {
        const isJoined = joinedTeams.includes(team.id);
        const isOwnTeam = team.created_by === currentUserId;

        return (
          <TeamSearchCard
            key={team.id}
            team={team}
            isJoined={isJoined}
            isOwnTeam={isOwnTeam}
            onJoinTeam={onJoinTeam}
            onViewTeam={onViewTeam}
          />
        );
      })}
    </div>
  );
};

export default TeamSearchResults;
