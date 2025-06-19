import React from "react";
import { Button } from "@/components/ui/button";
import TeamCard from "./TeamCard";
import { Team } from "@/types/teamTypes";

interface TeamGridProps {
  teams: Team[];
  onTeamClick: (teamId: string) => void;
  onLeaveTeam: (team: Team) => void;
}

const TeamGrid = ({ teams, onTeamClick, onLeaveTeam }: TeamGridProps) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {teams.map((team) => (
        <div key={team.id} className='relative'>
          <TeamCard
            team={{
              ...team,
              playerCount: team.numberOfPlayers || 0,
            }}
            onClick={() => onTeamClick(team._id)}
          />
          {!team.isCreator && (
            <Button
              size='sm'
              variant='outline'
              className='absolute top-2 right-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white'
              onClick={(e) => {
                e.stopPropagation();
                onLeaveTeam(team);
              }}
            >
              Leave
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeamGrid;
