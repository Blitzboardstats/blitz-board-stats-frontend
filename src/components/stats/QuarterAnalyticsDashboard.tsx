
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, Target, TrendingUp, Users, Award, Clock } from 'lucide-react';

interface QuarterStats {
  quarter: 1 | 2 | 3 | 4 | 5;
  playerPerformance: {
    playerId: string;
    playerName: string;
    jerseyNumber: string;
    totalPoints: number;
    qbCompletions: number;
    qbTouchdowns: number;
    runs: number;
    receptions: number;
    flagPulls: number;
    defInterceptions: number;
  }[];
  quarterCombinations: {
    qbPlayerId: string;
    qbPlayerName: string;
    receiverPlayerId: string;
    receiverPlayerName: string;
    completions: number;
    attempts: number;
    touchdowns: number;
    successRate: number;
  }[];
  quarterSummary: {
    totalPoints: number;
    totalTouchdowns: number;
    totalCompletions: number;
    totalFlagPulls: number;
  };
}

interface QuarterAnalyticsDashboardProps {
  teamId: string;
  gameStats: QuarterStats[];
  onOptimizeRoster: (recommendations: RosterRecommendation[]) => void;
}

interface RosterRecommendation {
  quarter: number;
  position: string;
  recommendedPlayer: string;
  reason: string;
  confidence: number;
}

export const QuarterAnalyticsDashboard = ({ 
  teamId, 
  gameStats, 
  onOptimizeRoster 
}: QuarterAnalyticsDashboardProps) => {
  const [selectedQuarter, setSelectedQuarter] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [analysisMode, setAnalysisMode] = useState<'performance' | 'combinations' | 'optimization'>('performance');

  // Calculate top performers by quarter
  const topPerformersByQuarter = useMemo(() => {
    return gameStats.reduce((acc, quarterData) => {
      const sortedPlayers = [...quarterData.playerPerformance]
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 5);
      
      acc[quarterData.quarter] = sortedPlayers;
      return acc;
    }, {} as Record<number, typeof gameStats[0]['playerPerformance']>);
  }, [gameStats]);

  // Calculate best QB-receiver combinations
  const bestCombinations = useMemo(() => {
    return gameStats.reduce((acc, quarterData) => {
      const sortedCombos = [...quarterData.quarterCombinations]
        .filter(combo => combo.attempts >= 2) // Minimum attempts
        .sort((a, b) => b.successRate - a.successRate)
        .slice(0, 3);
      
      acc[quarterData.quarter] = sortedCombos;
      return acc;
    }, {} as Record<number, typeof gameStats[0]['quarterCombinations']>);
  }, [gameStats]);

  // Generate roster optimization recommendations
  const generateRosterRecommendations = (): RosterRecommendation[] => {
    const recommendations: RosterRecommendation[] = [];
    
    gameStats.forEach(quarterData => {
      // Find best QB for this quarter
      const qbStats = quarterData.playerPerformance
        .filter(p => p.qbCompletions > 0 || p.qbTouchdowns > 0)
        .sort((a, b) => (b.qbCompletions + b.qbTouchdowns * 2) - (a.qbCompletions + a.qbTouchdowns * 2));
      
      if (qbStats.length > 0) {
        recommendations.push({
          quarter: quarterData.quarter,
          position: 'QB',
          recommendedPlayer: qbStats[0].playerName,
          reason: `Highest QB efficiency with ${qbStats[0].qbCompletions} completions and ${qbStats[0].qbTouchdowns} TDs`,
          confidence: Math.min(95, 60 + (qbStats[0].qbCompletions * 5))
        });
      }
      
      // Find best receiver for this quarter
      const receiverStats = quarterData.playerPerformance
        .filter(p => p.receptions > 0)
        .sort((a, b) => (b.receptions + b.totalPoints) - (a.receptions + a.totalPoints));
      
      if (receiverStats.length > 0) {
        recommendations.push({
          quarter: quarterData.quarter,
          position: 'WR',
          recommendedPlayer: receiverStats[0].playerName,
          reason: `Top receiver with ${receiverStats[0].receptions} receptions and ${receiverStats[0].totalPoints} points`,
          confidence: Math.min(90, 50 + (receiverStats[0].receptions * 8))
        });
      }
      
      // Find best defender for this quarter
      const defenderStats = quarterData.playerPerformance
        .filter(p => p.flagPulls > 0 || p.defInterceptions > 0)
        .sort((a, b) => (b.flagPulls + b.defInterceptions * 3) - (a.flagPulls + a.defInterceptions * 3));
      
      if (defenderStats.length > 0) {
        recommendations.push({
          quarter: quarterData.quarter,
          position: 'DEF',
          recommendedPlayer: defenderStats[0].playerName,
          reason: `Strong defense with ${defenderStats[0].flagPulls} flag pulls and ${defenderStats[0].defInterceptions} interceptions`,
          confidence: Math.min(85, 40 + (defenderStats[0].flagPulls * 3) + (defenderStats[0].defInterceptions * 10))
        });
      }
    });
    
    return recommendations;
  };

  const currentQuarterData = gameStats.find(q => q.quarter === selectedQuarter);
  const recommendations = generateRosterRecommendations();

  const handleOptimizeRoster = () => {
    onOptimizeRoster(recommendations);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Quarter-by-Quarter Analytics Dashboard
        </h2>
        <p className="text-gray-400 text-sm">
          Analyze player performance and optimize your roster based on quarter-specific data
        </p>
      </div>

      {/* Quarter Selector */}
      <Card className="bg-blitz-darkgray border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blitz-purple" />
              <span className="font-medium">Select Quarter:</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(quarter => (
                <Button
                  key={quarter}
                  variant={selectedQuarter === quarter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedQuarter(quarter as any)}
                  className={selectedQuarter === quarter ? "bg-blitz-purple" : ""}
                >
                  Q{quarter}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tabs */}
      <Tabs value={analysisMode} onValueChange={(value: any) => setAnalysisMode(value)}>
        <TabsList className="grid w-full grid-cols-3 bg-blitz-darkgray">
          <TabsTrigger value="performance" className="data-[state=active]:bg-blitz-purple">
            <Target className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="combinations" className="data-[state=active]:bg-blitz-purple">
            <Users className="w-4 h-4 mr-2" />
            Combinations
          </TabsTrigger>
          <TabsTrigger value="optimization" className="data-[state=active]:bg-blitz-purple">
            <Award className="w-4 h-4 mr-2" />
            Optimization
          </TabsTrigger>
        </TabsList>

        {/* Performance Analysis */}
        <TabsContent value="performance" className="space-y-4">
          {currentQuarterData && (
            <Card className="bg-blitz-darkgray border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Quarter {selectedQuarter} Performance Leaders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformersByQuarter[selectedQuarter]?.map((player, index) => (
                    <div key={player.playerId} className="flex items-center justify-between p-3 bg-blitz-charcoal rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={`${index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blitz-purple/20 text-blitz-purple'}`}>
                          #{index + 1}
                        </Badge>
                        <div>
                          <div className="font-medium">{player.playerName}</div>
                          <div className="text-sm text-gray-400">Jersey #{player.jerseyNumber}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-yellow-400">{player.totalPoints} pts</div>
                        <div className="text-xs text-gray-400">
                          {player.qbTouchdowns}TD • {player.receptions}Rec • {player.flagPulls}Flags
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Combination Analysis */}
        <TabsContent value="combinations" className="space-y-4">
          {currentQuarterData && (
            <Card className="bg-blitz-darkgray border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Quarter {selectedQuarter} Best QB-Receiver Combinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bestCombinations[selectedQuarter]?.map((combo, index) => (
                    <div key={`${combo.qbPlayerId}-${combo.receiverPlayerId}`} className="p-3 bg-blitz-charcoal rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-500/20 text-blue-400">QB</Badge>
                          <span className="font-medium">{combo.qbPlayerName}</span>
                          <span className="text-gray-400">→</span>
                          <Badge className="bg-green-500/20 text-green-400">WR</Badge>
                          <span className="font-medium">{combo.receiverPlayerName}</span>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400">
                          {combo.successRate.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>{combo.completions}/{combo.attempts} completions</span>
                        <span>{combo.touchdowns} touchdowns</span>
                      </div>
                    </div>
                  ))}
                  {(!bestCombinations[selectedQuarter] || bestCombinations[selectedQuarter].length === 0) && (
                    <div className="text-center text-gray-400 py-4">
                      No significant combinations found for Quarter {selectedQuarter}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Roster Optimization */}
        <TabsContent value="optimization" className="space-y-4">
          <Card className="bg-blitz-darkgray border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Roster Optimization Recommendations
                </div>
                <Button onClick={handleOptimizeRoster} className="bg-blitz-green hover:bg-blitz-green/80">
                  Apply Recommendations
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map(quarter => (
                  <div key={quarter} className="space-y-2">
                    <h4 className="font-medium text-blitz-purple">Quarter {quarter} Recommendations</h4>
                    <div className="grid gap-2">
                      {recommendations
                        .filter(rec => rec.quarter === quarter)
                        .map((rec, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-blitz-charcoal rounded">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blitz-purple/20 text-blitz-purple">{rec.position}</Badge>
                              <span className="font-medium">{rec.recommendedPlayer}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-400">{rec.reason}</div>
                              <Badge className={`${rec.confidence >= 80 ? 'bg-green-500/20 text-green-400' : rec.confidence >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                {rec.confidence}% confidence
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuarterAnalyticsDashboard;
