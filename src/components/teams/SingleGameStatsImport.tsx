
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, Calendar, Trophy, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { parseDirectStatsWithJerseyMatch, validateJerseyMatches, GameStatsData } from '@/utils/enhancedDirectStatsParser';
import { ProcessedPlayerStats } from '@/types/bulkStatsTypes';
import { Player } from '@/types/playerTypes';

interface SingleGameStatsImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  teamPlayers: Player[];
  onImportGameStats: (stats: ProcessedPlayerStats[], gameInfo: GameStatsData) => Promise<boolean>;
}

const SingleGameStatsImport = ({ 
  open, 
  onOpenChange, 
  teamId, 
  teamPlayers,
  onImportGameStats 
}: SingleGameStatsImportProps) => {
  const [rawData, setRawData] = useState('');
  const [processedStats, setProcessedStats] = useState<ProcessedPlayerStats[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameInfo, setGameInfo] = useState<GameStatsData>({
    opponent: '',
    gameDate: new Date().toISOString().split('T')[0],
    gameType: 'regular',
    isHomeGame: true,
    quarter: 1
  });
  const [validationResult, setValidationResult] = useState<{
    matched: string[], 
    unmatched: string[], 
    suggestions: Array<{jersey: string, suggestions: Player[]}>
  } | null>(null);

  const handleParseData = () => {
    try {
      // First validate jersey matches
      const validation = validateJerseyMatches(rawData, teamPlayers);
      setValidationResult(validation);
      
      // Parse the data with jersey matching
      const stats = parseDirectStatsWithJerseyMatch(rawData, teamPlayers, gameInfo);
      setProcessedStats(stats);
      
      if (stats.length > 0) {
        toast.success(`Parsed game stats for ${stats.length} players`);
        if (validation.unmatched.length > 0) {
          toast.warning(`${validation.unmatched.length} jersey numbers couldn't be matched to existing players`);
        }
      } else {
        toast.error('No valid stats data found');
      }
    } catch (error) {
      toast.error('Error parsing stats data');
      console.error(error);
    }
  };

  const handleImport = async () => {
    if (processedStats.length === 0) {
      toast.error('No stats to import');
      return;
    }

    if (!gameInfo.opponent.trim()) {
      toast.error('Please enter the opponent name');
      return;
    }

    setIsProcessing(true);
    
    try {
      const success = await onImportGameStats(processedStats, gameInfo);
      
      if (success) {
        toast.success(`Successfully imported game stats for ${processedStats.length} players`);
        onOpenChange(false);
        setRawData('');
        setProcessedStats([]);
        setValidationResult(null);
        setGameInfo({
          opponent: '',
          gameDate: new Date().toISOString().split('T')[0],
          gameType: 'regular',
          isHomeGame: true,
          quarter: 1
        });
      }
    } catch (error) {
      toast.error('Failed to import game stats');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blitz-charcoal text-white border-gray-800 max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Import Single Game Statistics
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Game Information Section */}
          <Card className="bg-blitz-darkgray border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Game Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="opponent">Opponent</Label>
                  <Input
                    id="opponent"
                    value={gameInfo.opponent}
                    onChange={(e) => setGameInfo(prev => ({ ...prev, opponent: e.target.value }))}
                    placeholder="Enter opponent team name"
                    className="bg-blitz-charcoal border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="gameDate">Game Date</Label>
                  <Input
                    id="gameDate"
                    type="date"
                    value={gameInfo.gameDate}
                    onChange={(e) => setGameInfo(prev => ({ ...prev, gameDate: e.target.value }))}
                    className="bg-blitz-charcoal border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="gameType">Game Type</Label>
                  <Select value={gameInfo.gameType} onValueChange={(value: any) => setGameInfo(prev => ({ ...prev, gameType: value }))}>
                    <SelectTrigger className="bg-blitz-charcoal border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-blitz-charcoal border-gray-600">
                      <SelectItem value="regular">Regular Season</SelectItem>
                      <SelectItem value="playoff">Playoff</SelectItem>
                      <SelectItem value="tournament">Tournament</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="homeAway">Home/Away</Label>
                  <Select value={gameInfo.isHomeGame.toString()} onValueChange={(value) => setGameInfo(prev => ({ ...prev, isHomeGame: value === 'true' }))}>
                    <SelectTrigger className="bg-blitz-charcoal border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-blitz-charcoal border-gray-600">
                      <SelectItem value="true">Home Game</SelectItem>
                      <SelectItem value="false">Away Game</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Input Section */}
          <Card className="bg-blitz-darkgray border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Step 1: Paste Game Stats Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-400">
                Paste your game statistics data below. The system will automatically match jersey numbers to existing players.
              </p>
              <Textarea
                placeholder="Jersey Number	QB Completions	QB TD	Runs	Reception	Player TD Points	QB TD Points	Extra Point 1	Extra Point 2	Def Interception	Pick 6	Safety	Flag Pulls	Total Points
2	7	4	6	0	5	6	1	0	0	0	0	8	34
3	2	3	0	0	3	0	0	1	1	0	0	5	22
..."
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                className="bg-blitz-charcoal border-gray-600 text-white min-h-[200px] font-mono text-sm"
              />
              <Button 
                onClick={handleParseData} 
                disabled={!rawData.trim()}
                className="bg-blitz-purple hover:bg-blitz-purple/80"
              >
                <Upload className="w-4 h-4 mr-2" />
                Parse Game Stats Data
              </Button>
            </CardContent>
          </Card>

          {/* Jersey Validation Section */}
          {validationResult && (
            <Card className="bg-blitz-darkgray border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Player Jersey Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {validationResult.matched.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">Matched Players ({validationResult.matched.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {validationResult.matched.map(jersey => (
                          <Badge key={jersey} className="bg-green-500/20 text-green-400">
                            #{jersey}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {validationResult.unmatched.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">Unmatched Jerseys ({validationResult.unmatched.length})</span>
                      </div>
                      <div className="space-y-2">
                        {validationResult.suggestions.map(({ jersey, suggestions }) => (
                          <div key={jersey} className="bg-blitz-charcoal rounded p-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-yellow-500/20 text-yellow-400">#{jersey}</Badge>
                              <span className="text-sm text-gray-400">No exact match found</span>
                            </div>
                            {suggestions.length > 0 && (
                              <div className="text-xs text-gray-500">
                                Similar: {suggestions.map(p => `${p.name} (#${p.jersey_number})`).join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-yellow-400 mt-2">
                        Unmatched players will be created as new temporary players. You can update their information later.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Parsed Data Preview */}
          {processedStats.length > 0 && (
            <Card className="bg-blitz-darkgray border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Step 2: Preview Game Stats ({processedStats.length} players)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="grid gap-3">
                    {processedStats.slice(0, 10).map((player, index) => (
                      <div key={index} className="bg-blitz-charcoal rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{player.playerName}</span>
                              <Badge className="bg-blitz-purple/20 text-blitz-purple">#{player.jerseyNumber}</Badge>
                              {player.playerId.startsWith('temp-') && (
                                <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">New Player</Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              vs {gameInfo.opponent} • {gameInfo.gameDate}
                            </div>
                          </div>
                          <div className="text-right text-sm space-y-1">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>🏈 {player.totalQbCompletions} comp</div>
                              <div>🎯 {player.totalQbTouchdowns} QB TD</div>
                              <div>🏃 {player.totalRuns} runs</div>
                              <div>🤲 {player.totalReceptions} rec</div>
                              <div>⭐ {player.totalPlayerTdPoints} TD pts</div>
                              <div>🛡️ {player.totalFlagPulls} flags</div>
                            </div>
                            <div className="font-bold text-yellow-400 text-center border-t border-gray-600 pt-1">
                              Total: {player.totalPoints} pts
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {processedStats.length > 10 && (
                      <div className="text-center text-gray-400 text-sm">
                        ... and {processedStats.length - 10} more players
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Import Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport}
              disabled={processedStats.length === 0 || isProcessing || !gameInfo.opponent.trim()}
              className="bg-blitz-green hover:bg-blitz-green/80"
            >
              {isProcessing ? 'Importing...' : `Import Game Stats for ${processedStats.length} Players`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SingleGameStatsImport;
