import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Undo, Square } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TeamScore {
  name: string;
  score: number;
}

interface GameClockManagerProps {
  isGameActive: boolean;
  onStartGame: () => void;
  onPauseGame: () => void;
  onUndoAction: () => void;
  onEndGame: () => void;
  canEdit: boolean;
  homeTeam?: TeamScore;
  awayTeam?: TeamScore;
  onUpdateScore?: (team: 'home' | 'away', points: number) => void;
}

export const GameClockManager = ({
  isGameActive,
  onStartGame,
  onPauseGame,
  onUndoAction,
  onEndGame,
  canEdit,
  homeTeam = { name: 'Home Team', score: 0 },
  awayTeam = { name: 'Away Team', score: 0 },
  onUpdateScore
}: GameClockManagerProps) => {
  const [gameTime, setGameTime] = useState(15 * 60); // 15 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [homeTimeouts, setHomeTimeouts] = useState(3);
  const [awayTimeouts, setAwayTimeouts] = useState(3);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && gameTime > 0) {
      interval = setInterval(() => {
        setGameTime(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, gameTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    // For game clock, just show minutes:seconds without AM/PM
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    onStartGame();
  };

  const handlePause = () => {
    setIsRunning(false);
    onPauseGame();
  };

  const useTimeout = (team: 'home' | 'away') => {
    if (team === 'home' && homeTimeouts > 0) {
      setHomeTimeouts(prev => prev - 1);
    } else if (team === 'away' && awayTimeouts > 0) {
      setAwayTimeouts(prev => prev - 1);
    }
  };

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
      className={`h-8 w-10 text-white font-bold text-xs ${color} rounded`}
      onClick={() => onUpdateScore?.(team, points)}
      disabled={!canEdit || !isGameActive}
    >
      <div className="text-center">
        <div className="text-xs font-bold">{label}</div>
        <div className="text-[8px]">+{points}</div>
      </div>
    </Button>
  );

  return (
    <div className="bg-blitz-darkgray border border-gray-700 rounded-lg p-6">
      {/* Team Scores - Referee View */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            {/* Home Team */}
            <div className="text-center flex-1">
              <div className="text-sm font-bold truncate">{homeTeam.name}</div>
              <div className="text-3xl font-bold text-green-500">{homeTeam.score}</div>
            </div>
            
            {/* Center - Quarter Display */}
            <div className="text-center flex-1 px-4">
              <Badge variant="outline" className="text-lg px-4 py-2 bg-gray-700 border-gray-600">
                Q{currentQuarter}
              </Badge>
            </div>
            
            {/* Away Team */}
            <div className="text-center flex-1">
              <div className="text-sm font-bold truncate">{awayTeam.name}</div>
              <div className="text-3xl font-bold text-purple-500">{awayTeam.score}</div>
            </div>
          </div>

          {/* Team Scoring Buttons */}
          {canEdit && isGameActive && (
            <div className="grid grid-cols-2 gap-4">
              {/* Home Team Buttons */}
              <div>
                <div className="text-center mb-2">
                  <h4 className="text-xs font-bold text-gray-400">{homeTeam.name}</h4>
                </div>
                <div className="flex justify-center space-x-1">
                  <ScoreButton label="TD" points={6} color="bg-green-600 hover:bg-green-700" team="home" />
                  <ScoreButton label="XP" points={1} color="bg-purple-600 hover:bg-purple-700" team="home" />
                  <ScoreButton label="SF" points={2} color="bg-orange-600 hover:bg-orange-700" team="home" />
                </div>
              </div>

              {/* Away Team Buttons */}
              <div>
                <div className="text-center mb-2">
                  <h4 className="text-xs font-bold text-gray-400">{awayTeam.name}</h4>
                </div>
                <div className="flex justify-center space-x-1">
                  <ScoreButton label="TD" points={6} color="bg-green-600 hover:bg-green-700" team="away" />
                  <ScoreButton label="XP" points={1} color="bg-purple-600 hover:bg-purple-700" team="away" />
                  <ScoreButton label="SF" points={2} color="bg-orange-600 hover:bg-orange-700" team="away" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Game Clock */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold mb-2">{formatTime(gameTime)}</div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          Quarter {currentQuarter}
        </Badge>
      </div>

      {/* Game Controls */}
      {canEdit && (
        <div className="flex justify-center space-x-4 mb-6">
          <Button
            onClick={handleStart}
            disabled={!isGameActive || isRunning}
            className="bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
              🏈
            </div>
            Start
          </Button>

          <Button
            onClick={handlePause}
            disabled={!isRunning}
            className="bg-yellow-600 hover:bg-yellow-700"
            size="lg"
          >
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
              🏈
            </div>
            Pause
          </Button>

          <Button
            onClick={onUndoAction}
            className="bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Undo size={20} className="mr-2" />
            Undo
          </Button>

          <Button
            onClick={onEndGame}
            variant="destructive"
            size="lg"
          >
            <Square size={20} className="mr-2" />
            End Game
          </Button>
        </div>
      )}

      {/* Timeouts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Home Timeouts</div>
          <div className="flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < homeTimeouts ? 'bg-blitz-purple' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          {canEdit && (
            <Button
              onClick={() => useTimeout('home')}
              disabled={homeTimeouts === 0}
              size="sm"
              className="mt-2"
            >
              Use Timeout
            </Button>
          )}
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Away Timeouts</div>
          <div className="flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < awayTimeouts ? 'bg-blitz-purple' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          {canEdit && (
            <Button
              onClick={() => useTimeout('away')}
              disabled={awayTimeouts === 0}
              size="sm"
              className="mt-2"
            >
              Use Timeout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
