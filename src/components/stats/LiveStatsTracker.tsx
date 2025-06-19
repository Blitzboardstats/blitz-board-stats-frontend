
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Flag } from 'lucide-react';

interface LivePlayerStat {
  playerId: string;
  playerName: string;
  position: string;
  completions: number;
  interceptions: number;
  tdPass: number;
  tdRun: number;
  extraPoint1: number;
  extraPoint2: number;
  receptions: number;
  runs: number;
  touchdowns: number;
  fumbles: number;
  defensiveInterceptions: number;
  sacks: number;
  pick6: number;
  flagPulls: number;
  safeties: number;
  totalPoints: number;
  lastAction?: string;
  lastActionTime?: string;
}

interface LiveStatsTrackerProps {
  selectedTeam: any;
  isGameActive: boolean;
  livePlayerStats: LivePlayerStat[];
}

export const LiveStatsTracker = ({
  selectedTeam,
  isGameActive,
  livePlayerStats
}: LiveStatsTrackerProps) => {
  if (!selectedTeam) return null;

  return (
    <Card className='bg-blitz-darkgray border-gray-700'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center justify-between text-lg'>
          <div className='flex items-center space-x-2'>
            <TrendingUp size={18} className='text-blitz-purple' />
            <span>Live Stats - {selectedTeam?.name}</span>
          </div>
          {isGameActive && (
            <Badge
              variant='outline'
              className='bg-green-500/20 text-green-400 border-green-500 text-xs'
            >
              LIVE
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0'>
        {!isGameActive ? (
          <div className='text-center text-gray-400 py-6'>
            <TrendingUp size={40} className='mx-auto mb-3 opacity-50' />
            <p className='text-sm'>
              Start a game to track live stats for {selectedTeam?.name}
            </p>
          </div>
        ) : (
          <div className='space-y-3'>
            {/* Live Stats Grid - Mobile Optimized */}
            <div className='space-y-3'>
              {livePlayerStats.map((player) => (
                <div
                  key={player.playerId}
                  className='bg-blitz-charcoal rounded-lg p-3 border border-gray-700'
                >
                  <div className='flex justify-between items-center mb-2'>
                    <div className='flex items-center space-x-2'>
                      <h4 className='font-semibold text-sm'>
                        {player.playerName}
                      </h4>
                      <Badge
                        variant='outline'
                        className='text-xs px-1 py-0'
                      >
                        {player.position}
                      </Badge>
                      {player.lastAction && (
                        <Badge className='bg-blitz-purple/20 text-blitz-purple text-xs px-1 py-0'>
                          {player.lastAction}
                        </Badge>
                      )}
                    </div>
                    <Badge className='bg-green-500/20 text-green-400 text-xs'>
                      {player.totalPoints}pts
                    </Badge>
                  </div>

                  {/* Compact Stats Display */}
                  <div className='grid grid-cols-3 gap-2 text-xs'>
                    {player.position === "QB" ? (
                      <>
                        <div className='text-center'>
                          <div className='text-gray-400 text-xs'>Comp</div>
                          <div className='font-semibold'>
                            {player.completions}
                          </div>
                        </div>
                        <div className='text-center'>
                          <div className='text-gray-400 text-xs'>
                            TD Pass
                          </div>
                          <div className='font-semibold text-green-400'>
                            {player.tdPass}
                          </div>
                        </div>
                        <div className='text-center'>
                          <div className='text-gray-400 text-xs'>INT</div>
                          <div className='font-semibold text-red-400'>
                            {player.interceptions}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className='text-center'>
                          <div className='text-gray-400 text-xs'>Rec</div>
                          <div className='font-semibold'>
                            {player.receptions}
                          </div>
                        </div>
                        <div className='text-center'>
                          <div className='text-gray-400 text-xs'>TD</div>
                          <div className='font-semibold text-green-400'>
                            {player.touchdowns}
                          </div>
                        </div>
                        <div className='text-center'>
                          <div className='text-gray-400 text-xs'>Flags</div>
                          <div className='font-semibold text-blue-400'>
                            {player.flagPulls}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Compact Game Summary */}
            <div className='bg-blitz-charcoal rounded-lg p-3 border border-gray-700 mt-4'>
              <h4 className='font-semibold mb-2 text-sm flex items-center space-x-2'>
                <Flag size={14} className='text-blitz-purple' />
                <span>Game Summary</span>
              </h4>
              <div className='grid grid-cols-4 gap-3 text-xs'>
                <div className='text-center'>
                  <div className='text-gray-400'>TDs</div>
                  <div className='font-semibold text-green-400'>
                    {livePlayerStats.reduce(
                      (sum, p) => sum + p.touchdowns + p.tdPass + p.tdRun,
                      0
                    )}
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-gray-400'>Points</div>
                  <div className='font-semibold text-blitz-purple'>
                    {livePlayerStats.reduce(
                      (sum, p) => sum + p.totalPoints,
                      0
                    )}
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-gray-400'>Flags</div>
                  <div className='font-semibold text-blue-400'>
                    {livePlayerStats.reduce(
                      (sum, p) => sum + p.flagPulls,
                      0
                    )}
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-gray-400'>Turns</div>
                  <div className='font-semibold text-red-400'>
                    {livePlayerStats.reduce(
                      (sum, p) => sum + p.interceptions + p.fumbles,
                      0
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
