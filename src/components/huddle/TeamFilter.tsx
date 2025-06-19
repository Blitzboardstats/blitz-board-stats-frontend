
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Users } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  logo_url?: string;
  football_type: string;
  age_group?: string;
  roleDetails?: string;
  userRole?: string;
}

interface TeamFilterProps {
  teams: Team[];
  selectedTeamId: string | null;
  onTeamSelect: (teamId: string) => void;
  onClearSelection: () => void;
}

const TeamFilter = ({ teams, selectedTeamId, onTeamSelect, onClearSelection }: TeamFilterProps) => {
  if (teams.length === 0) return null;

  const selectedTeam = teams.find(team => team.id === selectedTeamId);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-blitz-purple" />
          <h2 className="text-lg font-semibold text-white">Team Communication</h2>
        </div>
      </div>
      
      <div className="bg-blitz-darkgray border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-300">Select Team:</label>
          {teams.length > 1 && (
            <span className="text-xs text-gray-500">{teams.length} teams available</span>
          )}
        </div>
        
        <Select value={selectedTeamId || undefined} onValueChange={onTeamSelect}>
          <SelectTrigger className="w-full bg-blitz-charcoal border-gray-600 text-white">
            <SelectValue placeholder="Choose a team...">
              {selectedTeam && (
                <div className="flex items-center gap-3">
                  {selectedTeam.logo_url ? (
                    <img src={selectedTeam.logo_url} alt={selectedTeam.name} className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blitz-purple/20 flex items-center justify-center">
                      <span className="text-xs font-bold">{selectedTeam.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <div className="font-medium">{selectedTeam.name}</div>
                    <div className="text-xs text-gray-400">
                      {selectedTeam.football_type} Football
                      {selectedTeam.age_group && ` • ${selectedTeam.age_group}`}
                    </div>
                  </div>
                  <MessageCircle size={16} className="text-blitz-green" />
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-blitz-darkgray border-gray-600">
            {teams.map((team) => (
              <SelectItem 
                key={team.id} 
                value={team.id}
                className="text-white hover:bg-blitz-charcoal focus:bg-blitz-charcoal"
              >
                <div className="flex items-center gap-3 w-full">
                  {team.logo_url ? (
                    <img src={team.logo_url} alt={team.name} className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blitz-purple/20 flex items-center justify-center">
                      <span className="text-xs font-bold">{team.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{team.name}</div>
                    <div className="text-xs text-gray-400">
                      {team.football_type} Football
                      {team.age_group && ` • ${team.age_group}`}
                      <span className="ml-2 capitalize text-blitz-green">
                        {team.roleDetails || team.userRole}
                      </span>
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedTeam && (
          <div className="mt-3 p-3 bg-blitz-charcoal rounded-md">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-400">Currently viewing: </span>
                <span className="text-white font-medium">{selectedTeam.name}</span>
              </div>
              <div className="text-xs text-blitz-green capitalize">
                {selectedTeam.roleDetails || selectedTeam.userRole}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamFilter;
