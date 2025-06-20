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
import ManualPlayerEntry from "./ManualPlayerEntry";
import * as XLSX from "xlsx";

interface BulkPlayerImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportPlayers: (
    players: Omit<Player, "id" | "created_at">[]
  ) => Promise<boolean>;
  teamId: string;
}

const BulkPlayerImport = ({
  open,
  onOpenChange,
  onImportPlayers,
  teamId,
}: BulkPlayerImportProps) => {
  const [activeTab, setActiveTab] = useState("advanced");

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

      // Log the parsed data from raw input
      console.log("=== PARSED DATA FROM RAW INPUT booom ===");
      console.log("Raw data length:", rawData.length);
      console.log("Number of players parsed:", players.length);
      console.log("Parsed players:", JSON.stringify(players, null, 2));
      console.log("==================================");

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

      // Log the parsed data from simple raw input
      console.log("=== PARSED DATA FROM SIMPLE RAW INPUT ===");
      console.log("Simple raw data length:", simpleRawData.length);
      console.log("Number of players parsed:", players.length);
      console.log("Parsed players:", JSON.stringify(players, null, 2));
      console.log("==========================================");

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
      const players: Omit<Player, "id" | "created_at">[] = playersToImport.map(
        (player) => ({
          team_id: teamId,
          name: player.playerName,
          position: "",
          jersey_number: player.jerseyNumber,
          guardian_name: player.guardianName || "",
          guardian_email: player.guardianEmail || "",
          photo_url: undefined,
          graduation_year: undefined,
          recruit_profile: "",
        })
      );

      // Log the parsed data that will be sent to the backend
      console.log(
        "=== ADVANCED IMPORT - PARSED DATA TO BE SENT TO BACKEND ==="
      );
      console.log("Team ID:", teamId);
      console.log("Number of players:", players.length);
      console.log("Players data:", JSON.stringify(players, null, 2));
      console.log("==========================================================");

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
      const players: Omit<Player, "id" | "created_at">[] =
        simpleParsedPlayers.map((player) => ({
          team_id: teamId,
          name: player.playerName,
          position: "",
          jersey_number: player.jerseyNumber,
          guardian_name: player.guardianName || "",
          guardian_email: player.guardianEmail || "",
          photo_url: undefined,
          graduation_year: undefined,
          recruit_profile: "",
        }));

      // Log the parsed data that will be sent to the backend
      console.log("=== SIMPLE IMPORT - PARSED DATA TO BE SENT TO BACKEND ===");
      console.log("Team ID:", teamId);
      console.log("Number of players:", players.length);
      console.log("Players data:", JSON.stringify(players, null, 2));
      console.log("==========================================================");

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
      setActiveTab("advanced");
    }
    onOpenChange(open);
  };

  const playersToImport = getPlayersByDivision();

  const handleFileUpload = async (file: File) => {
    console.log("=== HANDLE FILE UPLOAD CALLED ===");
    console.log("Function received file:", file);

    try {
      console.log("=== FILE UPLOAD - FILE INFO ===");
      console.log("File name:", file.name);
      console.log("File size:", file.size, "bytes");
      console.log("File type:", file.type);
      console.log("================================");

      let fileContent = "";

      // Check if it's an Excel file
      if (
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls") ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        console.log("=== PROCESSING EXCEL FILE ===");

        // Read Excel file
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        console.log("Excel sheet name:", sheetName);
        console.log("Excel sheet data:", worksheet);

        // Convert to CSV format
        const csvData = XLSX.utils.sheet_to_csv(worksheet);
        fileContent = csvData;

        console.log("=== EXCEL CONVERTED TO CSV ===");
        console.log(
          "CSV content (first 500 chars):",
          csvData.substring(0, 500)
        );
        console.log("=================================");
      } else {
        console.log("=== PROCESSING TEXT FILE ===");

        // Read text file
        const reader = new FileReader();
        const textContent = await new Promise<string>((resolve, reject) => {
          reader.onload = (event) => {
            const content = event.target?.result as string;
            resolve(content);
          };
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsText(file);
        });

        fileContent = textContent;
        console.log("=== TEXT FILE CONTENT ===");
        console.log(
          "Text content (first 500 chars):",
          textContent.substring(0, 500)
        );
        console.log("===========================");
      }

      // Parse the file content
      try {
        const players = parsePlayerData(fileContent);
        console.log("=== PARSED DATA FROM UPLOADED FILE ===");
        console.log("Number of players parsed:", players.length);
        console.log("Parsed players:", JSON.stringify(players, null, 2));
        console.log("=======================================");

        // Set the parsed data to the raw data field
        setRawData(fileContent);
        setParsedPlayers(players);

        if (players.length > 0) {
          // Get unique divisions for selection
          const divisions = [...new Set(players.map((p) => p.division))];
          if (divisions.length === 1) {
            setSelectedDivision(divisions[0]);
          }
          toast.success(`Parsed ${players.length} players from uploaded file`);
        } else {
          toast.error("No valid player data found in uploaded file");
        }
      } catch (error) {
        console.error("Error parsing uploaded file:", error);
        toast.error("Error parsing uploaded file");
      }
    } catch (error) {
      toast.error("Error uploading file.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className='bg-blitz-charcoal text-white border-gray-800 max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold flex items-center gap-2'>
            <Upload className='w-5 h-5' />
            Player Import
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2 bg-blitz-darkgray'>
            <TabsTrigger
              value='advanced'
              className='text-white data-[state=active]:bg-blitz-purple'
            >
              <Upload className='w-4 h-4 mr-2' />
              Advanced Import
            </TabsTrigger>
            <TabsTrigger
              value='manual'
              className='text-white data-[state=active]:bg-blitz-purple'
            >
              <UserPlus className='w-4 h-4 mr-2' />
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value='advanced' className='mt-4'>
            <div className='space-y-6'>
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

          <TabsContent value='manual' className='mt-4'>
            <ManualPlayerEntry
              onImportPlayers={onImportPlayers}
              teamId={teamId}
              onCancel={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BulkPlayerImport;
