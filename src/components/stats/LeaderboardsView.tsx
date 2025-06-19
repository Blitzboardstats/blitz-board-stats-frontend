
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { useLeaderboards } from '@/hooks/useLeaderboards';
import { LeaderboardEntry } from '@/types/statsTypes';

export const LeaderboardsView = () => {
  const { leaderboards, isLoading } = useLeaderboards();

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-blitz-darkgray border-gray-800 animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!leaderboards) {
    return (
      <Card className="bg-blitz-darkgray border-gray-800">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">No leaderboard data available yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Complete some games to see season rankings.
          </p>
        </CardContent>
      </Card>
    );
  }

  const leaderboardSections = [
    { key: 'touchdowns', title: 'Touchdowns', icon: Trophy, color: 'text-yellow-500' },
    { key: 'passingYards', title: 'Offensive Point Leaders', icon: Medal, color: 'text-blue-500' },
    { key: 'rushingYards', title: 'QB Pass Completions', icon: Award, color: 'text-green-500' },
    { key: 'tackles', title: 'Flag Pulls Leaders', icon: Medal, color: 'text-red-500' },
    { key: 'interceptions', title: 'Interceptions', icon: Trophy, color: 'text-purple-500' },
    { key: 'sacks', title: 'Sacks', icon: Award, color: 'text-orange-500' }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-2">🏆 Season Leaderboards</h2>
        <p className="text-gray-400 text-sm">Top performers across all teams</p>
      </div>

      <div className="grid gap-4">
        {leaderboardSections.map((section) => {
          const data = leaderboards[section.key as keyof typeof leaderboards];
          const Icon = section.icon;
          
          return (
            <Card key={section.key} className="bg-blitz-darkgray border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Icon className={section.color} size={20} />
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data && data.length > 0 ? (
                  <div className="space-y-2">
                    {data.slice(0, 5).map((entry) => (
                      <LeaderboardRow key={entry.playerId} entry={entry} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No data available yet
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const LeaderboardRow = ({ entry }: { entry: LeaderboardEntry }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={16} />;
      case 2:
        return <Medal className="text-gray-400" size={16} />;
      case 3:
        return <Award className="text-orange-500" size={16} />;
      default:
        return <span className="text-gray-400 font-bold text-sm">#{rank}</span>;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8">
          {getRankIcon(entry.rank)}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              #{entry.playerNumber}
            </Badge>
            <span className="font-medium">{entry.playerName}</span>
          </div>
          <div className="text-xs text-gray-400">{entry.teamName}</div>
        </div>
      </div>
      <div className="text-xl font-bold text-blitz-purple">
        {entry.value}
      </div>
    </div>
  );
};
