import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DataInputStepProps {
  rawData: string;
  onRawDataChange: (data: string) => void;
  onParseData: () => void;
  onFileUpload?: (file: File) => void;
}

const DataInputStep = ({
  rawData,
  onRawDataChange,
  onParseData,
  onFileUpload,
}: DataInputStepProps) => {
  return (
    <Card className="bg-blitz-darkgray border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg">Step 1: Paste Player Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-black">
          Copy and paste your player data from the spreadsheet. Include the
          header row.
        </p>
        <input
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files[0] && onFileUpload) {
              onFileUpload(e.target.files[0]);
            }
          }}
          className="mb-2"
        />
        <Textarea
          placeholder="Jersey #	Team Name	Division	Season	Gridiron Battle	Player Name	Guardian Name	Guardian Email	Guardian Phone&#10;3	Coastal Crush	12U	Summer 2025	Flag	Collyn Garman..."
          value={rawData}
          onChange={(e) => onRawDataChange(e.target.value)}
          className="min-h-[120px] input-field font-mono text-sm"
        />
        <Button
          onClick={onParseData}
          disabled={!rawData.trim()}
          className="bg-blitz-purple hover:bg-blitz-purple/90"
        >
          Parse Player Data
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataInputStep;
