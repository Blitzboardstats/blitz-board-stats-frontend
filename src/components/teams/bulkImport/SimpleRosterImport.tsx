
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Users } from 'lucide-react';
import { ParsedPlayer } from '@/types/bulkImportTypes';

interface SimpleRosterImportProps {
  rawData: string;
  onRawDataChange: (data: string) => void;
  onParseData: () => void;
  parsedPlayers: ParsedPlayer[];
  isProcessing: boolean;
  onImport: () => void;
  onCancel: () => void;
}

const SimpleRosterImport = ({
  rawData,
  onRawDataChange,
  onParseData,
  parsedPlayers,
  isProcessing,
  onImport,
  onCancel
}: SimpleRosterImportProps) => {
  return (
    <div className="space-y-6">
      {/* Data Input Section */}
      <Card className="bg-blitz-darkgray border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg">Step 1: Paste Player Roster Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-400">
            Paste your player roster data below. Expected format: First Name, Last Name, Jersey Number
            (with headers in first row). Tab-separated or comma-separated values are supported.
          </p>
          <Textarea
            placeholder="First Name	Last Name	Jersey Number
Ellie	Weitzman	2
Livia	Rice	3
..."
            value={rawData}
            onChange={(e) => onRawDataChange(e.target.value)}
            className="bg-blitz-charcoal border-gray-600 text-white min-h-[200px] font-mono text-sm"
          />
          <Button 
            onClick={onParseData} 
            disabled={!rawData.trim()}
            className="bg-blitz-purple hover:bg-blitz-purple/80"
          >
            <Upload className="w-4 h-4 mr-2" />
            Parse Player Data
          </Button>
        </CardContent>
      </Card>

      {/* Parsed Players Preview */}
      {parsedPlayers.length > 0 && (
        <Card className="bg-blitz-darkgray border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Step 2: Preview Players to Import ({parsedPlayers.length} players)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[300px] overflow-y-auto">
              <div className="grid gap-2">
                {parsedPlayers.map((player, index) => (
                  <div key={index} className="flex items-center justify-between bg-blitz-charcoal rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blitz-purple/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blitz-purple">
                          {player.jerseyNumber}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{player.playerName}</div>
                        <div className="text-xs text-gray-400">Jersey #{player.jerseyNumber}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={onImport}
          disabled={parsedPlayers.length === 0 || isProcessing}
          className="bg-blitz-green hover:bg-blitz-green/80"
        >
          {isProcessing ? 'Importing...' : `Import ${parsedPlayers.length} Players`}
        </Button>
      </div>
    </div>
  );
};

export default SimpleRosterImport;
