
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { GroupedPlayer } from '@/types/groupedPlayerTypes';
import { Player } from '@/types/playerTypes';

interface GroupedPlayerCardProps {
  groupedPlayer: GroupedPlayer;
  onPlayerClick: (player: Player) => void;
  onTeamNavigate?: (teamId: string) => void;
}

export const GroupedPlayerCard = ({ 
  groupedPlayer, 
  onPlayerClick, 
  onTeamNavigate 
}: GroupedPlayerCardProps) => {
  
  // Get the first player for basic info display
  const primaryPlayer = groupedPlayer.players[0];
  
  // Convert to Player type for onClick handler
  const convertToPlayer = (playerData: any): Player => ({
    id: playerData.id,
    team_id: playerData.team_id,
    name: playerData.name,
    position: playerData.position,
    jersey_number: playerData.jersey_number,
    guardian_name: playerData.guardian_name,
    guardian_email: playerData.guardian_email,
    photo_url: playerData.photo_url,
    created_at: playerData.created_at
  });

  return (
    <Card className="bg-blitz-darkgray border border-gray-700 hover:border-blitz-purple/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {primaryPlayer.photo_url ? (
              <img 
                src={primaryPlayer.photo_url} 
                alt={groupedPlayer.player_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blitz-purple"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blitz-purple to-pink-500 flex items-center justify-center border-2 border-blitz-purple">
                <span className="text-white font-bold text-xl">
                  {groupedPlayer.player_name.charAt(0)}
                </span>
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {groupedPlayer.player_name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-blitz-green border-blitz-green">
                  {groupedPlayer.age_group}
                </Badge>
                {primaryPlayer.jersey_number && (
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    #{primaryPlayer.jersey_number}
                  </Badge>
                )}
                {primaryPlayer.position && (
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    {primaryPlayer.position}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Teams Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-blitz-purple" />
            <span className="text-sm font-medium text-white">
              Teams ({groupedPlayer.teams.length})
            </span>
          </div>
          
          <div className="space-y-2">
            {groupedPlayer.teams.map((team) => {
              const playerForTeam = groupedPlayer.players.find(p => p.team_id === team.team_id);
              
              return (
                <div 
                  key={team.team_id}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blitz-purple"></div>
                    <div>
                      <p className="text-white font-medium">{team.team_name}</p>
                      <p className="text-gray-400 text-sm">{team.age_group}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playerForTeam && onPlayerClick(convertToPlayer(playerForTeam))}
                      className="text-blitz-purple hover:bg-blitz-purple/20"
                    >
                      View Player
                    </Button>
                    {onTeamNavigate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTeamNavigate(team.team_id)}
                        className="text-gray-400 hover:bg-gray-700"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Multiple Teams Notice */}
        {groupedPlayer.teams.length > 1 && (
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
            <p className="text-blue-200 text-sm">
              <strong>Multi-Team Player:</strong> {groupedPlayer.player_name} is registered on {groupedPlayer.teams.length} teams. 
              You can manage all instances from this unified view.
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPlayerClick(convertToPlayer(primaryPlayer))}
            className="flex-1 border-blitz-purple text-blitz-purple hover:bg-blitz-purple hover:text-white"
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
