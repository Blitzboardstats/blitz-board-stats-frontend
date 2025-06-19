
import React, { useState } from "react";
import { LiveGameRosterManager } from "./LiveGameRosterManager";
import { GameControlsSection } from "./GameControlsSection";
import { ScoreManagementSection } from "./ScoreManagementSection";
import { PlayerManagementSection } from "./PlayerManagementSection";
import { StatsManagementSection } from "./StatsManagementSection";
import { useGameStatsManager } from "./GameStatsManager";
import { useGameState } from "./GameState";
import { useUserTeams } from "@/hooks/useUserTeams";
import { useGameStatsImport } from "@/hooks/useGameStatsImport";
import { usePlayerSeasonStatsTracker } from "@/hooks/usePlayerSeasonStatsTracker";

interface LiveGameLayoutProps {
  canEdit: boolean;
  selectedTeam: any;
  isGameActive?: boolean;
  canManageGame?: boolean;
  onStartGame?: () => void;
  onPauseGame?: () => void;
  onEndGame?: () => void;
  onUndo?: () => void;
}

export const LiveGameLayout = ({
  canEdit,
  selectedTeam,
  isGameActive = false,
  canManageGame = false,
  onStartGame = () => {},
  onPauseGame = () => {},
  onEndGame = () => {},
  onUndo = () => {}
}: LiveGameLayoutProps) => {
  const [showRosterManager, setShowRosterManager] = useState(false);
  const [showGameImport, setShowGameImport] = useState(false);
  const { teams } = useUserTeams();
  const primaryTeam = teams[0];

  // Initialize stats tracker
  const {
    getPlayerStats,
    updatePlayerStat,
    resetSessionStats,
    saveSessionStats,
    isSaving,
    hasSessionStats,
  } = usePlayerSeasonStatsTracker();

  const {
    homeTeam,
    awayTeam,
    currentQuarter,
    setCurrentQuarter,
    gameTime,
    setGameTime,
    isRunning,
    setIsRunning,
    selectedSide,
    setSelectedSide,
    activePlayers,
    selectedPlayer,
    updateScore,
    handleActivePlayersChange,
    handlePlayerSelect,
  } = useGameState({ teamId: selectedTeam.id });

  // Use first available team or show team name if available
  const { handleImportGameStats } = useGameStatsImport(primaryTeam);

  // Use the game stats manager hook
  const { handleEndGame, handleSaveStats } = useGameStatsManager({
    selectedTeam,
    homeTeam,
    hasSessionStats,
    saveSessionStats,
    onEndGame
  });

  // Get current player stats for display
  const currentPlayerStats = selectedPlayer
    ? getPlayerStats(selectedPlayer)
    : undefined;

  // Convert activePlayers to the format expected by other components
  const convertToPlayerJerseys = (players: any[]) => {
    return players.map(player => ({
      id: player.id,
      name: player.name,
      number: player.jersey_number?.toString() || player.number || "0",
      position: player.position || "",
      isActive: true
    }));
  };

  // Handle save stats with proper signature
  const handleSaveStatsWrapper = async () => {
    await handleSaveStats(primaryTeam);
  };

  if (showRosterManager) {
    return (
      <LiveGameRosterManager
        primaryTeam={primaryTeam}
        canEdit={canEdit}
        onActivePlayersChange={(players) => {
          const convertedPlayers = convertToPlayerJerseys(players);
          handleActivePlayersChange(convertedPlayers);
        }}
        onBackToGame={() => setShowRosterManager(false)}
      />
    );
  }

  return (
    <div className='space-y-2 bg-gray-800 text-white min-h-screen p-2'>
      {/* Score Management Section */}
      <ScoreManagementSection
        homeTeam={primaryTeam ? { ...homeTeam, name: primaryTeam.name } : homeTeam}
        awayTeam={awayTeam}
        currentQuarter={currentQuarter}
        setCurrentQuarter={setCurrentQuarter}
        canEdit={canEdit}
        gameTime={gameTime}
        isGameActive={isGameActive}
        updateScore={updateScore}
      />

      {/* Game Controls Section */}
      <GameControlsSection
        selectedTeam={selectedTeam}
        isGameActive={isGameActive}
        canManageGame={canManageGame}
        onStartGame={onStartGame}
        onPauseGame={onPauseGame}
        onEndGame={onEndGame}
        onUndo={onUndo}
        onFinalEndGame={handleEndGame}
        isSaving={isSaving}
      />

      {/* Player Management Section */}
      <PlayerManagementSection
        isGameActive={isGameActive}
        selectedPlayer={selectedPlayer}
        activePlayers={activePlayers}
        canEdit={canEdit}
        onManageRoster={() => setShowRosterManager(true)}
        onPlayerSelect={handlePlayerSelect}
        selectedSide={selectedSide}
        setSelectedSide={setSelectedSide}
        updatePlayerStat={updatePlayerStat}
      />

      {/* Stats Management Section */}
      <StatsManagementSection
        canEdit={canEdit}
        isGameActive={isGameActive}
        primaryTeam={primaryTeam}
        showGameImport={showGameImport}
        onShowGameImport={setShowGameImport}
        onImportGameStats={handleImportGameStats}
        selectedPlayer={selectedPlayer}
        currentPlayerStats={currentPlayerStats}
        activePlayers={activePlayers}
        hasSessionStats={hasSessionStats}
        isSaving={isSaving}
        onSaveStats={handleSaveStatsWrapper}
      />
    </div>
  );
};
