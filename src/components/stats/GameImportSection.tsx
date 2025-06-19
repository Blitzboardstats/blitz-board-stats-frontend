import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import SingleGameStatsImport from '../teams/SingleGameStatsImport';

interface GameImportSectionProps {
  canEdit: boolean;
  isGameActive: boolean;
  primaryTeam: any;
  showGameImport: boolean;
  onShowGameImport: (show: boolean) => void;
  onImportGameStats: (stats: any[], gameInfo: any) => Promise<boolean>;
}

export const GameImportSection = ({
  canEdit,
  isGameActive,
  primaryTeam,
  showGameImport,
  onShowGameImport,
  onImportGameStats
}: GameImportSectionProps) => {
  if (!canEdit || isGameActive || !primaryTeam) {
    return null;
  }

  return (
    <>
      <div className="mt-2 pt-2 border-t border-gray-600">
        <Button
          onClick={() => onShowGameImport(true)}
          variant="outline"
          size="sm"
          className="w-full border-blue-600 text-blue-300 hover:bg-blue-700/20"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Import Completed Game Stats
        </Button>
      </div>

      <SingleGameStatsImport
        open={showGameImport}
        onOpenChange={onShowGameImport}
        teamId={primaryTeam.id}
        teamPlayers={[]}
        onImportGameStats={onImportGameStats}
      />
    </>
  );
};
