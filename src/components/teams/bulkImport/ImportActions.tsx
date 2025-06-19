
import React from 'react';
import { Button } from '@/components/ui/button';

interface ImportActionsProps {
  selectedDivision: string;
  playersCount: number;
  isProcessing: boolean;
  onCancel: () => void;
  onImport: () => void;
}

const ImportActions = ({ 
  selectedDivision, 
  playersCount, 
  isProcessing, 
  onCancel, 
  onImport 
}: ImportActionsProps) => {
  if (!selectedDivision || playersCount === 0) {
    return null;
  }

  return (
    <div className="flex justify-end gap-3">
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="border-gray-600 text-gray-300"
      >
        Cancel
      </Button>
      <Button 
        onClick={onImport}
        disabled={isProcessing}
        className="bg-blitz-purple hover:bg-blitz-purple/90"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Importing...</span>
          </div>
        ) : (
          <>Import {playersCount} Players</>
        )}
      </Button>
    </div>
  );
};

export default ImportActions;
