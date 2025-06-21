import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Users, UserPlus } from "lucide-react";
import { parseSimplePlayerData } from "@/utils/simplePlayerDataParser";
import { convertKeysToCamelCase } from "@/utils/camelCase";
import { Player } from "@/types/playerTypes";
import { ParsedPlayer } from "@/types/bulkImportTypes";

interface SimpleBulkPlayerImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportPlayers: (players: Player[]) => Promise<boolean>;
  teamId: string;
}

const SimpleBulkPlayerImport = ({
  open,
  onOpenChange,
  onImportPlayers,
  teamId,
}: SimpleBulkPlayerImportProps) => {
  const [rawData, setRawData] = useState("");
  const [parsedPlayers, setParsedPlayers] = useState<ParsedPlayer[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleParseData = () => {
    try {
      const players = parseSimplePlayerData(rawData);
      setParsedPlayers(players);

      if (players.length > 0) {
        toast.success(`Parsed ${players.length} unique players successfully`);
      } else {
        toast.error("No valid player data found");
      }
    } catch (error) {
      toast.error("Error parsing player data");
      console.error(error);
    }
  };

  const handleImport = async () => {
    if (parsedPlayers.length === 0) {
      toast.error("No players to import");
      return;
    }

    setIsProcessing(true);

    try {
      const players: Player[] = parsedPlayers.map((player) => ({
        id: `player-${Date.now()}-${Math.random()}`,
        teamId: teamId,
        name: player.playerName,
        position: "",
        jerseyNumber: player.jerseyNumber,
        guardianName: player.guardianName || "",
        guardianEmail: player.guardianEmail || "",
        photoUrl: undefined,
        graduationYear: undefined,
        recruitProfile: "",
        createdAt: new Date(),
      }));

      const success = await onImportPlayers(players);

      if (success) {
        toast.success(`Successfully imported ${players.length} players`);
        onOpenChange(false);
        setRawData("");
        setParsedPlayers([]);
      }
    } catch (error) {
      toast.error("Failed to import players");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-blitz-charcoal text-white border-gray-800 max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold flex items-center gap-2'>
            <UserPlus className='w-5 h-5' />
            Simple Player Roster Import
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Data Input Section */}
          <Card className='bg-blitz-darkgray border-gray-700'>
            <CardHeader>
              <CardTitle className='text-lg'>
                Step 1: Paste Player Roster Data
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-sm text-gray-400'>
                Paste your player roster data below. Expected format: First
                Name, Last Name, Jersey Number (with headers in first row).
                Tab-separated or comma-separated values are supported.
              </p>
              <Textarea
                placeholder='First Name	Last Name	Jersey Number
Ellie	Weitzman	2
Livia	Rice	3
...'
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                className='bg-blitz-charcoal border-gray-600 text-white min-h-[200px] font-mono text-sm'
              />
              <Button
                onClick={handleParseData}
                disabled={!rawData.trim()}
                className='bg-blitz-purple hover:bg-blitz-purple/80'
              >
                <Upload className='w-4 h-4 mr-2' />
                Parse Player Data
              </Button>
            </CardContent>
          </Card>

          {/* Parsed Players Preview */}
          {parsedPlayers.length > 0 && (
            <Card className='bg-blitz-darkgray border-gray-700'>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Users className='w-5 h-5' />
                  Step 2: Preview Players to Import ({parsedPlayers.length}{" "}
                  players)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='max-h-[300px] overflow-y-auto'>
                  <div className='grid gap-2'>
                    {parsedPlayers.map((player, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between bg-blitz-charcoal rounded-lg p-3'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-blitz-purple/20 rounded-full flex items-center justify-center'>
                            <span className='text-sm font-bold text-blitz-purple'>
                              {player.jerseyNumber}
                            </span>
                          </div>
                          <div>
                            <div className='font-medium'>
                              {player.playerName}
                            </div>
                            <div className='text-xs text-gray-400'>
                              Jersey #{player.jerseyNumber}
                            </div>
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
          <div className='flex justify-end gap-3'>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={parsedPlayers.length === 0 || isProcessing}
              className='bg-blitz-green hover:bg-blitz-green/80'
            >
              {isProcessing
                ? "Importing..."
                : `Import ${parsedPlayers.length} Players`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleBulkPlayerImport;
