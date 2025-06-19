
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTeamStats } from '@/hooks/useTeamStats';
import { Trophy, Target, Shield, TrendingUp } from 'lucide-react';
import { TeamStats } from '@/types/statsTypes';

export const TeamStatsView = () => {
  const { teamStats, isLoading } = useTeamStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-blitz-darkgray border-gray-800 animate-pulse">
            <CardContent className="p-6">
              <div className="h-24 bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (!teamStats || teamStats.length === 0) {
    return (
      <Card className="bg-blitz-darkgray border-gray-800">
        <CardContent className="p-6 text-center">
          <p className="text-black">No team statistics available yet.</p>
          <p className="text-sm text-black mt-2">
            Play some games to see team performance data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {teamStats.map((team) => (
        <TeamStatsCard key={team.teamId} teamStats={team} />
      ))}
    </div>
  );
};

const TeamStatsCard = ({ teamStats }: { teamStats: TeamStats }) => {
  return (
    <Card className="bg-blitz-darkgray border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-blitz-purple">{teamStats.teamName}</span>
          <Badge variant="outline" className="text-blitz-purple border-blitz-purple">
            {teamStats.season || 'Current Season'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Win/Loss Record */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="text-green-500 mr-1" size={16} />
              <span className="text-sm text-black">Wins</span>
            </div>
            <div className="text-2xl font-bold text-black">{teamStats.wins}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <span className="text-sm text-black">Losses</span>
            </div>
            <div className="text-2xl font-bold text-black">{teamStats.losses}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <span className="text-sm text-black">Draws</span>
            </div>
            <div className="text-2xl font-bold text-black">{teamStats.draws}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="text-blitz-purple mr-1" size={16} />
              <span className="text-sm text-black">Win %</span>
            </div>
            <div className="text-2xl font-bold text-black">
              {teamStats.winPercentage.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Points Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="text-green-500" size={16} />
              <span className="text-sm font-medium text-black">Points Scored</span>
            </div>
            <div className="text-xl font-bold text-black">{teamStats.pointsScored}</div>
            <div className="text-xs text-black">
              Avg: <span className="text-black">{teamStats.averagePointsScored.toFixed(1)}</span> per game
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="text-blue-800" size={16} />
              <span className="text-sm font-medium text-black">Points Allowed</span>
            </div>
            <div className="text-xl font-bold text-black">{teamStats.pointsAllowed}</div>
            <div className="text-xs text-black">
              Avg: <span className="text-black">{teamStats.averagePointsAllowed.toFixed(1)}</span> per game
            </div>
          </div>
        </div>

        {/* Point Differential */}
        <div className="pt-2">
          <div className="text-center">
            <div className="text-sm text-black mb-1">Point Differential</div>
            <div className="text-lg font-bold text-black">
              {teamStats.pointsScored - teamStats.pointsAllowed > 0 ? '+' : ''}
              {teamStats.pointsScored - teamStats.pointsAllowed}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
