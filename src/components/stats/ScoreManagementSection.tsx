
import React from 'react';
import { ScoreSection } from './ScoreSection';
import { TeamScoreButtons } from './TeamScoreButtons';

interface ScoreManagementSectionProps {
  homeTeam: any;
  awayTeam: any;
  currentQuarter: number;
  setCurrentQuarter: (quarter: number) => void;
  canEdit: boolean;
  gameTime: number;
  isGameActive: boolean;
  updateScore: (team: 'home' | 'away', points: number) => void;
}

export const ScoreManagementSection = ({
  homeTeam,
  awayTeam,
  currentQuarter,
  setCurrentQuarter,
  canEdit,
  gameTime,
  isGameActive,
  updateScore
}: ScoreManagementSectionProps) => {
  return (
    <>
      {/* Score Section - Compact with team name */}
      <ScoreSection
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        currentQuarter={currentQuarter}
        setCurrentQuarter={setCurrentQuarter}
        canEdit={canEdit}
        gameTime={gameTime}
        isGameActive={isGameActive}
      />

      {/* Team Score Buttons - Moved directly under scoreboard */}
      <div className={`transition-opacity ${!isGameActive ? "opacity-50" : ""}`}>
        <TeamScoreButtons
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          updateScore={updateScore}
          canEdit={canEdit}
          isGameActive={isGameActive}
        />
      </div>
    </>
  );
};
