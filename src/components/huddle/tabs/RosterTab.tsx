
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { TeamCoach } from '@/types/teamTypes';
import { Player } from '@/types/playerTypes';

interface Team {
  id: string;
  name: string;
  players?: Player[];
}

interface RosterTabProps {
  teams: Team[];
  selectedTeamId: string | null;
  selectedTeam: Team | undefined;
  teamLoading: boolean;
  team: Team | null;
  coaches: TeamCoach[];
  onSendMessageToMember: (member: any, type: 'player' | 'coach') => void;
}

const RosterTab = ({
  teams,
  selectedTeamId,
  selectedTeam,
  teamLoading,
  team,
  coaches,
  onSendMessageToMember
}: RosterTabProps) => {
  return (
    <Card className="bg-blitz-darkgray border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl break-words">Team Roster & Communication</CardTitle>
      </CardHeader>
      <CardContent>
        {teams.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>You haven't joined any teams yet.</p>
          </div>
        ) : selectedTeamId ? (
          <div className="space-y-6">
            {teamLoading ? (
              <div className="text-center text-gray-400 py-8">
                <p>Loading team roster...</p>
              </div>
            ) : (
              <div className="bg-blitz-charcoal rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">{selectedTeam?.name} Roster</h3>
                
                {/* Coaches Section */}
                <div className="mb-6">
                  <h4 className="text-md font-medium mb-3 text-blitz-green">Coaching Staff</h4>
                  <div className="space-y-2">
                    {coaches.length === 0 ? (
                      <div className="text-gray-400 text-sm">No coaches added yet.</div>
                    ) : (
                      coaches.map((coach) => (
                        <div key={coach.id} className="flex items-center justify-between p-3 bg-blitz-darkgray rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blitz-purple/20 text-blitz-purple text-xs">
                                {coach.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-black">{coach.name}</div>
                              <div className="text-sm text-black">{coach.role}</div>
                              {coach.email && (
                                <div className="text-xs text-black">{coach.email}</div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-blitz-purple hover:bg-blitz-purple/10"
                            onClick={() => onSendMessageToMember(coach, 'coach')}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Players Section */}
                <div>
                  <h4 className="text-md font-medium mb-3 text-blitz-green">Players</h4>
                  <div className="space-y-2">
                    {team?.players?.length === 0 ? (
                      <div className="text-gray-400 text-sm">No players added yet.</div>
                    ) : (
                      team?.players?.map((player) => (
                        <div key={player.id} className="flex items-center justify-between p-3 bg-blitz-darkgray rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              {player.photo_url ? (
                                <AvatarImage src={player.photo_url} alt={player.name} />
                              ) : (
                                <AvatarFallback className="bg-blitz-purple/20 text-blitz-purple text-xs">
                                  {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-black">{player.name}</span>
                                {player.jersey_number && (
                                  <Badge variant="outline" className="bg-blitz-purple/20 text-blitz-purple border-transparent text-xs">
                                    #{player.jersey_number}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-black">
                                {player.position && `${player.position} • `}
                                {player.guardian_name && `Guardian: ${player.guardian_name}`}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-blitz-purple hover:bg-blitz-purple/10"
                            onClick={() => onSendMessageToMember(player, 'player')}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      )) || null
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center text-gray-400 py-8">
              <p>Select a team from the "Your Teams" section above to view its roster and send messages.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RosterTab;
