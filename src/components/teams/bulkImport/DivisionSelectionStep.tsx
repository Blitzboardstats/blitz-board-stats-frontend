
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ParsedPlayer } from '@/types/bulkImportTypes';

interface DivisionSelectionStepProps {
  parsedPlayers: ParsedPlayer[];
  selectedDivision: string;
  onSelectDivision: (division: string) => void;
}

const DivisionSelectionStep = ({ 
  parsedPlayers, 
  selectedDivision, 
  onSelectDivision 
}: DivisionSelectionStepProps) => {
  const divisions = [...new Set(parsedPlayers.map(p => p.division))];

  return (
    <Card className="bg-blitz-darkgray border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg">Step 2: Select Division/Age Group</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-400">
          Choose which division to import (you'll need to repeat this process for each division):
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {divisions.map(division => (
            <Button
              key={division}
              variant={selectedDivision === division ? "default" : "outline"}
              onClick={() => onSelectDivision(division)}
              className={selectedDivision === division ? "bg-blitz-purple" : "border-gray-600"}
            >
              {division}
              <Badge variant="secondary" className="ml-2">
                {parsedPlayers.filter(p => p.division === division).length}
              </Badge>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DivisionSelectionStep;
