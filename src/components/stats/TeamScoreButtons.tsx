
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TeamScore {
  name: string;
  score: number;
}

interface TeamScoreButtonsProps {
  homeTeam: TeamScore;
  awayTeam: TeamScore;
  updateScore: (team: 'home' | 'away', points: number) => void;
  canEdit: boolean;
  isGameActive: boolean;
}

export const TeamScoreButtons = ({
  homeTeam,
  awayTeam,
  updateScore,
  canEdit,
  isGameActive
}: TeamScoreButtonsProps) => {
  const ScoreButton = ({ 
    label, 
    points, 
    color, 
    team 
  }: { 
    label: string; 
    points: number; 
    color: string; 
    team: 'home' | 'away';
  }) => (
    <Button
      className={`h-10 w-12 text-white font-bold text-xs ${color} rounded`}
      onClick={() => updateScore(team, points)}
      disabled={!canEdit || !isGameActive}
    >
      <div className="text-center">
        <div className="text-xs font-bold">{label}</div>
        <div className="text-[8px]">+{points}</div>
      </div>
    </Button>
  );

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Home Team */}
          <div>
            <div className="text-center mb-2">
              <h3 className="text-sm font-bold truncate">{homeTeam.name}</h3>
            </div>
            <div className="flex justify-center space-x-1">
              <ScoreButton label="TD" points={6} color="bg-green-600 hover:bg-green-700" team="home" />
              <ScoreButton label="XP" points={1} color="bg-purple-600 hover:bg-purple-700" team="home" />
              <ScoreButton label="SF" points={2} color="bg-orange-600 hover:bg-orange-700" team="home" />
            </div>
          </div>

          {/* Away Team */}
          <div>
            <div className="text-center mb-2">
              <h3 className="text-sm font-bold truncate">{awayTeam.name}</h3>
            </div>
            <div className="flex justify-center space-x-1">
              <ScoreButton label="TD" points={6} color="bg-green-600 hover:bg-green-700" team="away" />
              <ScoreButton label="XP" points={1} color="bg-purple-600 hover:bg-purple-700" team="away" />
              <ScoreButton label="SF" points={2} color="bg-orange-600 hover:bg-orange-700" team="away" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
