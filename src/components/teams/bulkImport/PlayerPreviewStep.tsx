
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle, AlertCircle } from 'lucide-react';
import { ParsedPlayer } from '@/types/bulkImportTypes';

interface PlayerPreviewStepProps {
  selectedDivision: string;
  playersToImport: ParsedPlayer[];
}

const PlayerPreviewStep = ({ selectedDivision, playersToImport }: PlayerPreviewStepProps) => {
  return (
    <Card className="bg-blitz-darkgray border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          Preview: {selectedDivision} Players ({playersToImport.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {playersToImport.map((player, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blitz-purple/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blitz-purple">
                    {player.jerseyNumber || '?'}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{player.playerName}</div>
                  <div className="text-sm text-gray-400">
                    {player.guardianName && `Guardian: ${player.guardianName}`}
                    {player.guardianEmail && ` • ${player.guardianEmail}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {player.guardianEmail ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerPreviewStep;
