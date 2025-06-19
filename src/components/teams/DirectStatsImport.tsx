
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, BarChart3, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { parseDirectStatsWithJerseyMatch, validateJerseyMatches } from '@/utils/enhancedDirectStatsParser';
import { ProcessedPlayerStats } from '@/types/bulkStatsTypes';
import { Player } from '@/types/playerTypes';

interface DirectStatsImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  teamPlayers: Player[];
  onImportStats: (stats: ProcessedPlayerStats[]) => Promise<boolean>;
}

const DirectStatsImport = ({ open, onOpenChange, teamId, teamPlayers, onImportStats }: DirectStatsImportProps) => {
  const [rawData, setRawData] = useState('');
  const [processedStats, setProcessedStats] = useState<ProcessedPlayerStats[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
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
      const stats = parseDirectStatsWithJerseyMatch(rawData, teamPlayers);
      setProcessedStats(stats);
      
      if (stats.length > 0) {
        toast.success(`Parsed season stats for ${stats.length} players`);
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

    setIsProcessing(true);
    
    try {
      const success = await onImportStats(processedStats);
      
      if (success) {
        toast.success(`Successfully imported season stats for ${processedStats.length} players`);
        onOpenChange(false);
        setRawData('');
        setProcessedStats([]);
        setValidationResult(null);
      }
    } catch (error) {
      toast.error('Failed to import stats');
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
            <BarChart3 className="w-5 h-5" />
            Import Season Statistics
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Data Input Section */}
          <Card className="bg-blitz-darkgray border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Step 1: Paste Your Season Stats Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-400">
                Paste your season statistics data below. The system will automatically match jersey numbers to existing players.
                Expected format: Jersey Number, QB Completions, QB TD, Runs, Reception, Player TD Points, QB TD Points, Extra Point 1, Extra Point 2, Def Interception, Pick 6, Safety, Flag Pulls, Team Member Total Points (tab-separated).
              </p>
              <Textarea
                placeholder="Jersey Number	SUM of QB Completions	SUM of QB TD	SUM of Runs	SUM of Reception...
2			7	4	6	0						5	6
3			2	3	0	0						3	0
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
                Parse Season Stats Data
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
                        Unmatched players will be treated as new players. You can update their information later.
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
                  <Users className="w-5 h-5" />
                  Step 2: Preview Season Stats ({processedStats.length} players)
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
                              {player.season} Season • {player.gamesPlayed} games
                            </div>
                          </div>
                          <div className="text-right text-sm space-y-1">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>🏈 {player.totalQbCompletions} completions</div>
                              <div>🎯 {player.totalQbTouchdowns} QB TDs</div>
                              <div>🏃 {player.totalRuns} runs</div>
                              <div>🤲 {player.totalReceptions} receptions</div>
                              <div>⭐ {player.totalPlayerTdPoints} player TD pts</div>
                              <div>🛡️ {player.totalFlagPulls} flag pulls</div>
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
              disabled={processedStats.length === 0 || isProcessing}
              className="bg-blitz-green hover:bg-blitz-green/80"
            >
              {isProcessing ? 'Importing...' : `Import Season Stats for ${processedStats.length} Players`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DirectStatsImport;
