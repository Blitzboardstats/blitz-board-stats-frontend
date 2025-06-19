
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Shield, Plus } from 'lucide-react';

interface PlayerSeasonStats {
  playerId: string;
  qbCompletions: number;
  qbTouchdowns: number;
  runs: number;
  receptions: number;
  playerTdPoints: number;
  qbTdPoints: number;
  extraPoint1: number;
  extraPoint2: number;
  defInterceptions: number;
  pick6: number;
  safeties: number;
  flagPulls: number;
  totalPoints: number;
}

interface LiveSeasonStatsDisplayProps {
  selectedPlayer?: string;
  playerStats?: PlayerSeasonStats;
  activePlayers: Array<{ id: string; name: string; number: string }>;
  isGameActive: boolean;
}

export const LiveSeasonStatsDisplay = ({
  selectedPlayer,
  playerStats,
  activePlayers,
  isGameActive,
}: LiveSeasonStatsDisplayProps) => {
  const selectedPlayerName = activePlayers.find(p => p.id === selectedPlayer)?.name || 'Unknown';
  
  if (!selectedPlayer || !playerStats) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-blue-400 flex items-center space-x-2">
            <Target size={16} />
            <span>Live Session Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center text-gray-400 text-xs py-4">
            {isGameActive ? 'Select a player to view live stats' : 'Start game to track stats'}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate total touchdowns for display
  const totalPlayerTDs = Math.floor(playerStats.playerTdPoints / 6);
  const totalQBTDs = playerStats.qbTouchdowns;

  // Debug logging
  console.log('Player TD Debug:', {
    playerTdPoints: playerStats.playerTdPoints,
    calculatedTDs: totalPlayerTDs,
    totalPoints: playerStats.totalPoints
  });

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-blue-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target size={16} />
            <span>Live Session Stats</span>
          </div>
          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
            #{activePlayers.find(p => p.id === selectedPlayer)?.number} {selectedPlayerName}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3">
          {/* Offensive Stats */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-green-400 flex items-center space-x-1">
              <Trophy size={12} />
              <span>Offense</span>
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-300">QB Completions:</span>
                <Badge variant="secondary" className="text-xs">{playerStats.qbCompletions}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">QB TDs:</span>
                <Badge variant="secondary" className="text-xs">{totalQBTDs}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Player TDs:</span>
                <Badge variant="secondary" className="text-xs">{totalPlayerTDs}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Runs:</span>
                <Badge variant="secondary" className="text-xs">{playerStats.runs}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Receptions:</span>
                <Badge variant="secondary" className="text-xs">{playerStats.receptions}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Extra Pts:</span>
                <Badge variant="secondary" className="text-xs">
                  {playerStats.extraPoint1 + playerStats.extraPoint2}
                </Badge>
              </div>
            </div>
          </div>

          {/* Defensive Stats */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-red-400 flex items-center space-x-1">
              <Shield size={12} />
              <span>Defense</span>
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-300">Interceptions:</span>
                <Badge variant="secondary" className="text-xs">{playerStats.defInterceptions}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Pick 6:</span>
                <Badge variant="secondary" className="text-xs">{playerStats.pick6}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Flag Pulls:</span>
                <Badge variant="secondary" className="text-xs">{playerStats.flagPulls}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Safeties:</span>
                <Badge variant="secondary" className="text-xs">{playerStats.safeties}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Total Points */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-yellow-400">Session Points:</span>
            <Badge className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold">
              {playerStats.totalPoints} pts
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
