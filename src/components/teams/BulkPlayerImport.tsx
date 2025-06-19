import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Player } from "@/types/playerTypes";
import { ParsedPlayer } from "@/types/bulkImportTypes";
import { Upload, UserPlus } from "lucide-react";
import { parsePlayerData } from "@/utils/playerDataParser";
import { parseSimplePlayerData } from "@/utils/simplePlayerDataParser";
import DataInputStep from "./bulkImport/DataInputStep";
import DivisionSelectionStep from "./bulkImport/DivisionSelectionStep";
import PlayerPreviewStep from "./bulkImport/PlayerPreviewStep";
import ImportActions from "./bulkImport/ImportActions";
import SimpleRosterImport from "./bulkImport/SimpleRosterImport";

interface BulkPlayerImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportPlayers: (players: Player[]) => Promise<boolean>;
  teamId: string;
}

const BulkPlayerImport = ({
  open,
  onOpenChange,
  onImportPlayers,
  teamId,
}: BulkPlayerImportProps) => {
  const [activeTab, setActiveTab] = useState("simple");

  // Advanced import states
  const [rawData, setRawData] = useState("");
  const [parsedPlayers, setParsedPlayers] = useState<ParsedPlayer[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Simple import states
  const [simpleRawData, setSimpleRawData] = useState("");
  const [simpleParsedPlayers, setSimpleParsedPlayers] = useState<
    ParsedPlayer[]
  >([]);
  const [isSimpleProcessing, setIsSimpleProcessing] = useState(false);

  const handleParseData = () => {
    try {
      const players = parsePlayerData(rawData);
      setParsedPlayers(players);

      if (players.length > 0) {
        // Get unique divisions for selection
        const divisions = [...new Set(players.map((p) => p.division))];
        if (divisions.length === 1) {
          setSelectedDivision(divisions[0]);
        }
        toast.success(`Parsed ${players.length} players successfully`);
      } else {
        toast.error("No valid player data found");
      }
    } catch (error) {
      toast.error("Error parsing player data");
      console.error(error);
    }
  };

  const handleParseSimpleData = () => {
    try {
      const players = parseSimplePlayerData(simpleRawData);
      setSimpleParsedPlayers(players);

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

  const getPlayersByDivision = () => {
    if (!selectedDivision) return [];
    return parsedPlayers.filter(
      (player) => player.division === selectedDivision
    );
  };

  const handleAdvancedImport = async () => {
    const playersToImport = getPlayersByDivision();

    if (playersToImport.length === 0) {
      toast.error("No players selected for import");
      return;
    }

    setIsProcessing(true);

    try {
      const players: Player[] = playersToImport.map((player) => ({
        id: `player-${Date.now()}-${Math.random()}`,
        team_id: teamId,
        name: player.playerName,
        position: "",
        jersey_number: player.jerseyNumber,
        guardian_name: player.guardianName || "",
        guardian_email: player.guardianEmail || "",
        photo_url: undefined,
        graduation_year: undefined,
        recruit_profile: "",
        created_at: new Date(),
      }));

      const success = await onImportPlayers(players);

      if (success) {
        toast.success(`Successfully imported ${players.length} players`);
        resetAdvancedForm();
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Failed to import players");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimpleImport = async () => {
    if (simpleParsedPlayers.length === 0) {
      toast.error("No players to import");
      return;
    }

    setIsSimpleProcessing(true);

    try {
      const players: Player[] = simpleParsedPlayers.map((player) => ({
        id: `player-${Date.now()}-${Math.random()}`,
        team_id: teamId,
        name: player.playerName,
        position: "",
        jersey_number: player.jerseyNumber,
        guardian_name: player.guardianName || "",
        guardian_email: player.guardianEmail || "",
        photo_url: undefined,
        graduation_year: undefined,
        recruit_profile: "",
        created_at: new Date(),
      }));

      const success = await onImportPlayers(players);

      if (success) {
        toast.success(`Successfully imported ${players.length} players`);
        resetSimpleForm();
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Failed to import players");
      console.error(error);
    } finally {
      setIsSimpleProcessing(false);
    }
  };

  const resetAdvancedForm = () => {
    setRawData("");
    setParsedPlayers([]);
    setSelectedDivision("");
  };

  const resetSimpleForm = () => {
    setSimpleRawData("");
    setSimpleParsedPlayers([]);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetAdvancedForm();
      resetSimpleForm();
      setActiveTab("simple");
    }
    onOpenChange(open);
  };

  const playersToImport = getPlayersByDivision();

  const handleFileUpload = async (file: File) => {
    // Upload file to backend (replace URL with your API endpoint)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("teamId", teamId);
    try {
      // Replace '/api/upload-roster' with your actual backend endpoint
      const response = await fetch("/api/upload-roster", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        toast.success("Roster file uploaded successfully!");
        onOpenChange(false);
      } else {
        toast.error("Failed to upload roster file.");
      }
    } catch (error) {
      toast.error("Error uploading file.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="bg-blitz-charcoal text-white border-gray-800 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Player Import
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-blitz-darkgray">
            <TabsTrigger
              value="simple"
              className="data-[state=active]:bg-blitz-purple"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Simple Roster
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="data-[state=active]:bg-blitz-purple"
            >
              <Upload className="w-4 h-4 mr-2" />
              Advanced Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="mt-4">
            <SimpleRosterImport
              rawData={simpleRawData}
              onRawDataChange={setSimpleRawData}
              onParseData={handleParseSimpleData}
              parsedPlayers={simpleParsedPlayers}
              isProcessing={isSimpleProcessing}
              onImport={handleSimpleImport}
              onCancel={() => onOpenChange(false)}
            />
          </TabsContent>

          <TabsContent value="advanced" className="mt-4">
            <div className="space-y-6">
              <DataInputStep
                rawData={rawData}
                onRawDataChange={setRawData}
                onParseData={handleParseData}
                onFileUpload={handleFileUpload}
              />

              {parsedPlayers.length > 0 && (
                <DivisionSelectionStep
                  parsedPlayers={parsedPlayers}
                  selectedDivision={selectedDivision}
                  onSelectDivision={setSelectedDivision}
                />
              )}

              {selectedDivision && playersToImport.length > 0 && (
                <PlayerPreviewStep
                  selectedDivision={selectedDivision}
                  playersToImport={playersToImport}
                />
              )}

              <ImportActions
                selectedDivision={selectedDivision}
                playersCount={playersToImport.length}
                isProcessing={isProcessing}
                onCancel={() => onOpenChange(false)}
                onImport={handleAdvancedImport}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BulkPlayerImport;
