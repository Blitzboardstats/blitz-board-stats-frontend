
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePlayerStats } from '@/hooks/usePlayerStats';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContextOptimized';

export const PlayerStatsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const { playerStats, isLoading } = usePlayerStats();
  const { user, isAdmin } = useAuth();
  const { permissions } = usePermissions();

  // Filter stats based on permissions
  const filteredStats = playerStats.filter(player => {
    // Search filter
    const matchesSearch = player.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.playerNumber.includes(searchTerm) ||
                         player.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Position filter
    const matchesPosition = positionFilter === 'all' || player.position === positionFilter;
    
    // Permission filter - admins can see all, others need specific permissions
    const hasStatsPermission = isAdmin || permissions.canViewPlayerStats(player.playerId, player.guardianEmail);
    
    return matchesSearch && matchesPosition && (permissions.canViewAllPlayerStats || hasStatsPermission);
  });

  const uniquePositions = [...new Set(playerStats.map(p => p.position))];

  if (isLoading) {
    return (
      <Card className="bg-blitz-darkgray border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blitz-purple"></div>
            <span className="ml-2 text-gray-400">Loading player statistics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin/Permission Notice */}
      {isAdmin ? (
        <Card className="bg-green-900/20 border-green-500/50">
          <CardContent className="p-4">
            <p className="text-blue-800 text-sm">
              🔑 Admin Access: You can view all player statistics across all teams.
            </p>
          </CardContent>
        </Card>
      ) : !permissions.canViewAllPlayerStats && (
        <Card className="bg-amber-900/20 border-amber-500/50">
          <CardContent className="p-4">
            <p className="text-amber-400 text-sm">
              ℹ️ You can view detailed player statistics only for players where you are listed as the guardian.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter Controls */}
      <Card className="bg-blitz-darkgray border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl">Player Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, number, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-blitz-charcoal border-gray-600 text-black"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="bg-blitz-charcoal border-gray-600 text-black">
                  <SelectValue placeholder="Filter by position" />
                </SelectTrigger>
                <SelectContent className="bg-blitz-charcoal border-gray-600">
                  <SelectItem value="all" className="text-black">All Positions</SelectItem>
                  {uniquePositions.map(position => (
                    <SelectItem key={position} value={position} className="text-black">
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStats.length === 0 ? (
          <Card className="bg-blitz-darkgray border-gray-700 md:col-span-2 lg:col-span-3">
            <CardContent className="p-6 text-center">
              <p className="text-gray-400">
                {isAdmin || permissions.canViewAllPlayerStats 
                  ? "No players found matching your search criteria."
                  : "No player statistics available for players you are guardian for."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredStats.map((player) => (
            <Card key={player.playerId} className="bg-blitz-darkgray border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>#{player.playerNumber} {player.playerName}</span>
                </CardTitle>
                <div className="text-sm text-gray-400">
                  <p>{player.position} • {player.teamName}</p>
                  <p>{player.gamesPlayed} games played</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Flag Football Offensive Stats */}
                <div>
                  <h4 className="font-medium text-black mb-2">🏈 Offensive Stats</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black">Touchdowns:</span>
                      <span className="text-black">{player.touchdowns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Receptions:</span>
                      <span className="text-black">{player.receptions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Completions:</span>
                      <span className="text-black">{player.completions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Pass Yards:</span>
                      <span className="text-black">{player.passingYards}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Rush Yards:</span>
                      <span className="text-black">{player.rushingYards}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Extra Points:</span>
                      <span className="text-black">{player.extraPoints}</span>
                    </div>
                  </div>
                </div>

                {/* Flag Football Defensive Stats */}
                <div>
                  <h4 className="font-medium text-black mb-2">🛡️ Defensive Stats</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black">Flag Pulls:</span>
                      <span className="text-black">{player.tackles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Sacks:</span>
                      <span className="text-black">{player.sacks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Interceptions:</span>
                      <span className="text-black">{player.interceptions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Safeties:</span>
                      <span className="text-black">{player.safeties}</span>
                    </div>
                  </div>
                </div>

                {/* Total Points */}
                <div className="pt-2 border-t border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-black">Total Points:</span>
                    <span className="text-xl font-bold text-black">{player.totalPoints}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
