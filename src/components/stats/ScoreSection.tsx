
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TeamScore {
  name: string;
  score: number;
}

interface ScoreSectionProps {
  homeTeam: TeamScore;
  awayTeam: TeamScore;
  currentQuarter: number;
  setCurrentQuarter: (quarter: number) => void;
  canEdit: boolean;
  gameTime?: number;
  isGameActive?: boolean;
}

export const ScoreSection = ({
  homeTeam,
  awayTeam,
  currentQuarter,
  setCurrentQuarter,
  canEdit,
  gameTime = 15 * 60,
  isGameActive = false,
}: ScoreSectionProps) => {
  console.log({ homeTeam });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    // For game clock, just show minutes:seconds without AM/PM
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getQuarterDisplay = (quarter: number) => {
    switch (quarter) {
      case 5:
        return "OT 1";
      case 6:
        return "OT 2";
      default:
        return quarter.toString();
    }
  };

  return (
    <Card className='bg-gray-800 border-gray-700'>
      <CardContent className='p-3'>
        <div className='flex justify-between items-center'>
          {/* Home Team */}
          <div className='text-center flex-1'>
            <div className='text-sm font-bold truncate'>{homeTeam.name}</div>
            <div className='text-2xl font-bold text-green-500'>
              {homeTeam.score}
            </div>
          </div>

          {/* Center - Quarter and Clock */}
          <div className='text-center flex-1 px-2'>
            <div className='text-gray-400 text-xs mb-1'>Q</div>
            <div className='flex items-center justify-center space-x-2 mb-1'>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setCurrentQuarter(Math.max(1, currentQuarter - 1))
                }
                disabled={!canEdit}
                className='h-8 w-8 p-0 text-sm bg-gray-700 border-gray-600 hover:bg-gray-600'
              >
                -
              </Button>
              <Badge
                variant='outline'
                className='text-sm px-3 py-1 bg-gray-700 border-gray-600'
              >
                {getQuarterDisplay(currentQuarter)}
              </Badge>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setCurrentQuarter(Math.min(6, currentQuarter + 1))
                }
                disabled={!canEdit}
                className='h-8 w-8 p-0 text-sm bg-gray-700 border-gray-600 hover:bg-gray-600'
              >
                +
              </Button>
            </div>
            <div className='flex items-center justify-center space-x-1'>
              {isGameActive && (
                <div className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></div>
              )}
              <div className='text-lg font-bold'>{formatTime(gameTime)}</div>
            </div>
          </div>

          {/* Away Team */}
          <div className='text-center flex-1'>
            <div className='text-sm font-bold truncate'>{awayTeam.name}</div>
            <div className='text-2xl font-bold text-purple-500'>
              {awayTeam.score}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
