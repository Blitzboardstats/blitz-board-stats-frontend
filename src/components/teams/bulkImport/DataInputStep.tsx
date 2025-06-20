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
    <Card className='bg-blitz-darkgray border-gray-700'>
      <CardHeader>
        <CardTitle className='text-lg'>Step 1: Paste Player Data</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-sm text-black'>
          Copy and paste your player data from the spreadsheet or upload an
          Excel file (.xlsx, .xls) or text file (.csv, .tsv). Include the header
          row. Expected format: Player First Name, Player Last Name, Jersey
          Number, Guardian Email, Guardian First Name, Guardian Last Name
        </p>
        <input
          type='file'
          accept='.csv,.tsv,.txt,.xlsx,.xls,text/csv,text/tab-separated-values,text/plain,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
          onChange={(e) => {
            console.log("=== FILE INPUT CHANGE ===");
            console.log("Files selected:", e.target.files);
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              console.log("Selected file:", file.name, file.type, file.size);
              if (onFileUpload) {
                console.log("Calling onFileUpload...");
                onFileUpload(file);
              } else {
                console.log("onFileUpload is not defined");
              }
            } else {
              console.log("No file selected");
            }
            console.log("==========================");
          }}
          className='mb-2'
        />
        <Textarea
          placeholder='Player First Name	Player Last Name	Jersey Number	Guardian Email	Guardian First Name	Guardian Last Name&#10;John	Smith	1	john.smith@email.com	Jane	Smith&#10;Mike	Johnson	2	mike.johnson@email.com	Sarah	Johnson...'
          value={rawData}
          onChange={(e) => onRawDataChange(e.target.value)}
          className='min-h-[120px] input-field font-mono text-sm'
        />
        <Button
          onClick={onParseData}
          disabled={!rawData.trim()}
          className='bg-blitz-purple hover:bg-blitz-purple/90'
        >
          Parse Player Data
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataInputStep;
