import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Shield, Users } from 'lucide-react';

interface FlagFootballPlayerStats {
  playerId: string;
  playerName: string;
  position: string;
  
  // QB Stats
  completions: number;
  interceptions: number;
  tdPass: number;
  tdRun: number;
  extraPoint1: number;
  extraPoint2: number;
  
  // Offensive Stats
  receptions: number;
  runs: number;
  touchdowns: number;
  fumbles: number;
  
  // Flag Football Defensive Stats
  defensiveInterceptions: number;
  sacks: number;
  pick6: number;
  flagPulls: number; // Flag-specific metric
  safeties: number;
  
  totalPoints: number;
}

interface PlayerStatsDisplayProps {
  players: FlagFootballPlayerStats[];
}

export const PlayerStatsDisplay = ({ players }: PlayerStatsDisplayProps) => {
  const quarterbacks = players.filter(p => 
    p.position?.toLowerCase().includes('qb') || 
    p.position?.toLowerCase().includes('quarterback') ||
    (p.completions > 0 || p.tdPass > 0)
  );

  const offensivePlayers = players.filter(p => 
    !quarterbacks.includes(p) && 
    (p.receptions > 0 || p.runs > 0 || p.touchdowns > 0)
  );

  const defensivePlayers = players.filter(p => 
    p.defensiveInterceptions > 0 || p.sacks > 0 || p.pick6 > 0 || 
    p.flagPulls > 0 || p.safeties > 0
  );

  const calculateQBPoints = (player: FlagFootballPlayerStats) => {
    return (player.tdPass * 6) + (player.tdRun * 6) + 
           player.extraPoint1 + (player.extraPoint2 * 2);
  };

  const calculateOffensivePoints = (player: FlagFootballPlayerStats) => {
    return (player.touchdowns * 6) + player.extraPoint1 + (player.extraPoint2 * 2);
  };

  const calculateDefensivePoints = (player: FlagFootballPlayerStats) => {
    return (player.pick6 * 6) + (player.safeties * 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blitz-purple mb-2">Flag Football Player Stats</h2>
        <p className="text-gray-400">Season statistics for flag football specific metrics</p>
      </div>

      {/* Quarterback Stats */}
      {quarterbacks.length > 0 && (
        <Card className="bg-blitz-darkgray border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="text-blitz-purple" size={20} />
              <span>Quarterback Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quarterbacks.map(player => (
                <div key={player.playerId} className="bg-blitz-charcoal rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-lg">{player.playerName}</h4>
                    <Badge className="bg-blitz-purple/20 text-blitz-purple">
                      {calculateQBPoints(player)} pts
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Completions:</span>
                      <span className="ml-2 font-semibold">{player.completions}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Interceptions:</span>
                      <span className="ml-2 font-semibold text-red-400">{player.interceptions}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">TD Pass:</span>
                      <span className="ml-2 font-semibold text-green-400">{player.tdPass}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">TD Run:</span>
                      <span className="ml-2 font-semibold text-green-400">{player.tdRun}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Extra Pt 1:</span>
                      <span className="ml-2 font-semibold">{player.extraPoint1}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Extra Pt 2:</span>
                      <span className="ml-2 font-semibold">{player.extraPoint2}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offensive Player Stats */}
      {offensivePlayers.length > 0 && (
        <Card className="bg-blitz-darkgray border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="text-green-500" size={20} />
              <span>Flag Football Offensive Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {offensivePlayers.map(player => (
                <div key={player.playerId} className="bg-blitz-charcoal rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-lg">{player.playerName}</h4>
                    <Badge className="bg-green-500/20 text-green-400">
                      {calculateOffensivePoints(player)} pts
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Receptions:</span>
                      <span className="ml-2 font-semibold">{player.receptions}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Runs:</span>
                      <span className="ml-2 font-semibold">{player.runs}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Touchdowns:</span>
                      <span className="ml-2 font-semibold text-green-400">{player.touchdowns}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Fumbles:</span>
                      <span className="ml-2 font-semibold text-red-400">{player.fumbles}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Extra Pt 1:</span>
                      <span className="ml-2 font-semibold">{player.extraPoint1}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Extra Pt 2:</span>
                      <span className="ml-2 font-semibold">{player.extraPoint2}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flag Football Defensive Player Stats */}
      {defensivePlayers.length > 0 && (
        <Card className="bg-blitz-darkgray border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="text-red-500" size={20} />
              <span>Flag Football Defensive Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {defensivePlayers.map(player => (
                <div key={player.playerId} className="bg-blitz-charcoal rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-lg">{player.playerName}</h4>
                    <Badge className="bg-red-500/20 text-red-400">
                      {calculateDefensivePoints(player)} pts
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Interceptions:</span>
                      <span className="ml-2 font-semibold text-green-400">{player.defensiveInterceptions}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Sacks:</span>
                      <span className="ml-2 font-semibold">{player.sacks}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Pick 6:</span>
                      <span className="ml-2 font-semibold text-green-400">{player.pick6}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Flag Pulls:</span>
                      <span className="ml-2 font-semibold text-blue-400">{player.flagPulls}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Safeties:</span>
                      <span className="ml-2 font-semibold text-blue-400">{player.safeties}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {players.length === 0 && (
        <Card className="bg-blitz-darkgray border-gray-700">
          <CardContent className="text-center py-8">
            <p className="text-gray-400">No flag football stats recorded yet</p>
            <p className="text-sm text-gray-500">Start tracking plays to see flag football statistics</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
