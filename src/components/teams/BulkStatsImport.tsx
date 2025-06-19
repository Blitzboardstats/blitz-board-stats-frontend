
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, BarChart3, Users } from 'lucide-react';
import { parseStatsData, processPlayerStats } from '@/utils/statsDataParser';
import { ParsedGameStats, ProcessedPlayerStats } from '@/types/bulkStatsTypes';

interface BulkStatsImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  onImportStats: (stats: ProcessedPlayerStats[]) => Promise<boolean>;
}

const BulkStatsImport = ({ open, onOpenChange, teamId, onImportStats }: BulkStatsImportProps) => {
  const [rawData, setRawData] = useState('');
  const [parsedGameStats, setParsedGameStats] = useState<ParsedGameStats[]>([]);
  const [processedStats, setProcessedStats] = useState<ProcessedPlayerStats[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleParseData = () => {
    try {
      const gameStats = parseStatsData(rawData);
      setParsedGameStats(gameStats);
      
      const playerStats = processPlayerStats(gameStats);
      setProcessedStats(playerStats);
      
      if (gameStats.length > 0) {
        toast.success(`Parsed ${gameStats.length} game records for ${playerStats.length} players`);
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
        toast.success(`Successfully imported stats for ${processedStats.length} players`);
        onOpenChange(false);
        setRawData('');
        setParsedGameStats([]);
        setProcessedStats([]);
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
            Bulk Player Stats Import - Comprehensive Season Statistics
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Data Input Section */}
          <Card className="bg-blitz-darkgray border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Step 1: Paste Spreadsheet Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-400">
                Paste your comprehensive spreadsheet data below. Players will be matched by Jersey # only. 
                Expected columns: Jersey #, Guardian Email, Event Type, Home Squad, Away Squad, 
                Gridiron Battle, Division, Matchup Format, Club/Organization, City, Season, Game #, QB Completions, QB TD, Runs, Receptions, 
                Player TD Points, QB TD Points, Extra Point 1, Extra Point 2, Def Interceptions, Pick 6, Safety, Flag Pulls
              </p>
              <Textarea
                placeholder="Paste your complete spreadsheet data here (including headers)..."
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                className="bg-blitz-charcoal border-gray-600 text-white min-h-[200px]"
              />
              <Button 
                onClick={handleParseData} 
                disabled={!rawData.trim()}
                className="bg-blitz-purple hover:bg-blitz-purple/80"
              >
                <Upload className="w-4 h-4 mr-2" />
                Parse Complete Stats Data
              </Button>
            </CardContent>
          </Card>

          {/* Parsed Data Preview */}
          {processedStats.length > 0 && (
            <Card className="bg-blitz-darkgray border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Step 2: Preview Processed Season Stats ({processedStats.length} players)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="grid gap-3">
                    {processedStats.slice(0, 10).map((player, index) => (
                      <div key={index} className="bg-blitz-charcoal rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="font-medium">#{player.jerseyNumber}</span>
                            {player.guardianEmail && (
                              <span className="text-sm text-gray-400 ml-2">({player.guardianEmail})</span>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              {player.division} • {player.season} • {player.gamesPlayed} games
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
                            <div className="font-bold text-black text-center border-t border-gray-600 pt-1">
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

export default BulkStatsImport;
