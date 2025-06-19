
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Player } from '@/types/playerTypes';
import { usePlayerTeams } from '@/hooks/usePlayerTeams';
import { usePlayerSeasonStats } from '@/hooks/usePlayerSeasonStats';
import { Heart, Users, Trophy, TrendingUp, Calendar, Star, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MyPlayerCardProps {
  player: Player;
  currentTeamId: string;
  onPlayerClick?: (player: Player) => void;
}

export const MyPlayerCard = ({ player, currentTeamId, onPlayerClick }: MyPlayerCardProps) => {
  const { playerTeams, isLoading: teamsLoading } = usePlayerTeams(player.id);
  const { stats } = usePlayerSeasonStats({ playerId: player.id, teamId: currentTeamId });
  const navigate = useNavigate();

  const handleTeamNavigation = (teamId: string) => {
    if (teamId !== currentTeamId) {
      navigate(`/team/${teamId}`, { state: { activeTab: 'my-player' } });
    }
  };

  const otherTeams = playerTeams.filter(team => team.id !== currentTeamId);

  console.log('MyPlayerCard: Player teams:', playerTeams, 'Current team:', currentTeamId, 'Other teams:', otherTeams);

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10 border-purple-300/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {player.photo_url ? (
              <div className="relative">
                <img
                  src={player.photo_url}
                  alt={player.name}
                  className="w-20 h-20 rounded-full object-cover border-3 border-purple-400/40 shadow-lg"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white fill-white" />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white fill-white" />
                </div>
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-xl text-white flex items-center gap-2 mb-2">
                {player.name}
                <Badge variant="secondary" className="bg-pink-100/90 text-pink-800 border-pink-200 shadow-sm">
                  <Heart className="w-3 h-3 mr-1 fill-current" />
                  My Child
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                {player.position && (
                  <span className="flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded-full">
                    <Users className="w-3 h-3" />
                    {player.position}
                  </span>
                )}
                {player.jersey_number && (
                  <span className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
                    <Trophy className="w-3 h-3" />
                    #{player.jersey_number}
                  </span>
                )}
                {player.graduation_year && (
                  <span className="flex items-center gap-1 bg-purple-500/20 px-2 py-1 rounded-full">
                    <Calendar className="w-3 h-3" />
                    Class of {player.graduation_year}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Season Stats */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            Season Stats
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-400/30">
              <div className="text-lg font-bold text-blue-300">
                {stats?.games_played || 0}
              </div>
              <div className="text-xs text-blue-200">Games</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg border border-green-400/30">
              <div className="text-lg font-bold text-green-300">
                {(stats?.player_td_points || 0) + (stats?.qb_td_points || 0)}
              </div>
              <div className="text-xs text-green-200">TDs</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-400/30">
              <div className="text-lg font-bold text-purple-300">
                {stats?.total_points || 0}
              </div>
              <div className="text-xs text-purple-200">Points</div>
            </div>
          </div>
        </div>

        {/* Other Teams - More Prominent Display */}
        {teamsLoading ? (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              <span className="ml-2 text-sm text-gray-400">Loading teams...</span>
            </div>
          </div>
        ) : (
          <>
            {otherTeams.length > 0 ? (
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-400/30">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Also plays for {otherTeams.length} other team{otherTeams.length !== 1 ? 's' : ''}:
                </h4>
                <div className="space-y-2">
                  {otherTeams.map((team) => (
                    <div key={team.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{team.name}</div>
                          {team.age_group && (
                            <div className="text-xs text-gray-400">{team.age_group}</div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTeamNavigation(team.id)}
                        className="border-blue-400/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 transition-all duration-200"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Team
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-center text-gray-400">
                  <Users className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Only plays for this team</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => onPlayerClick?.(player)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
