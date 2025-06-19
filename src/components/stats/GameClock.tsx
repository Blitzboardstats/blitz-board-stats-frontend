
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play } from 'lucide-react';

interface GameClockProps {
  gameTime: number;
  isGameActive: boolean;
  canEdit: boolean;
  onReset: () => void;
}

export const GameClock = ({ gameTime, isGameActive, canEdit, onReset }: GameClockProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    // Convert to 12-hour format
    let displayMins = mins;
    let period = '';
    
    if (mins === 0 && secs === 0) {
      return '0:00';
    }
    
    // For game time, we don't need AM/PM, just show minutes:seconds
    return `${displayMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <div className="text-4xl font-bold text-black">{formatTime(gameTime)}</div>
          </div>
          
          {canEdit && (
            <div className="flex space-x-2">
              <Button
                onClick={onReset}
                className="bg-gray-600 hover:bg-gray-700"
                size="sm"
              >
                <RotateCcw size={16} />
                Reset
              </Button>
              
              {isGameActive && (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold"
                  onClick={() => {}}
                >
                  <Play size={16} className="mr-2" />
                  Live Flag
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
