
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Shield } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  logo_url?: string;
  football_type: string;
  age_group?: string;
}

interface TeamSelectorProps {
  teams: Team[];
  selectedTeamId?: string;
  onTeamSelect: (teamId: string) => void;
  userRole?: string;
}

export const TeamSelector = ({ teams, selectedTeamId, onTeamSelect, userRole }: TeamSelectorProps) => {
  const selectedTeam = teams.find(team => team.id === selectedTeamId);

  if (teams.length === 0) {
    return (
      <Card className="bg-blitz-darkgray border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="text-gray-400">
            No teams available for live game tracking
          </div>
        </CardContent>
      </Card>
    );
  }

  if (teams.length === 1) {
    const team = teams[0];
    return (
      <Card className="bg-blitz-darkgray border-gray-700">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {team.logo_url ? (
                <img src={team.logo_url} alt={team.name} className="w-8 h-8 rounded" />
              ) : (
                <div className="w-8 h-8 bg-blitz-purple rounded flex items-center justify-center">
                  <Users size={16} className="text-white" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-black">{team.name}</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-400">{team.football_type}</p>
                  {team.age_group && (
                    <>
                      <span className="text-gray-500 text-xs">•</span>
                      <p className="text-xs text-gray-400">{team.age_group}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {userRole && (
                <Badge variant="outline" className="text-xs">
                  <Shield size={10} className="mr-1" />
                  {userRole}
                </Badge>
              )}
              <Badge className="bg-green-600 text-white text-xs">
                TRACKING
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-blitz-darkgray border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center space-x-2">
          <Users size={16} className="text-blitz-purple" />
          <span>Select Team for Live Tracking</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Select value={selectedTeamId} onValueChange={onTeamSelect}>
          <SelectTrigger className="w-full bg-blitz-gray border-gray-600">
            <SelectValue placeholder="Choose team to track..." />
          </SelectTrigger>
          <SelectContent className="bg-blitz-darkgray border-gray-600">
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id} className="text-black hover:bg-blitz-gray">
                <div className="flex items-center space-x-2 w-full">
                  {team.logo_url ? (
                    <img src={team.logo_url} alt={team.name} className="w-5 h-5 rounded" />
                  ) : (
                    <div className="w-5 h-5 bg-blitz-purple rounded flex items-center justify-center">
                      <Users size={12} className="text-white" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{team.name}</span>
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <span>{team.football_type}</span>
                      {team.age_group && (
                        <>
                          <span>•</span>
                          <span>{team.age_group}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedTeam && (
          <div className="mt-3 p-2 bg-blitz-charcoal rounded border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-600 text-white text-xs">
                  NOW TRACKING
                </Badge>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-black">{selectedTeam.name}</span>
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <span>{selectedTeam.football_type}</span>
                    {selectedTeam.age_group && (
                      <>
                        <span>•</span>
                        <span>{selectedTeam.age_group}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {userRole && (
                <Badge variant="outline" className="text-xs">
                  <Shield size={10} className="mr-1" />
                  {userRole}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
