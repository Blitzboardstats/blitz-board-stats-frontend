
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Target,
  Gamepad2,
  Flag,
} from "lucide-react";
import { useGameSession } from "@/hooks/useGameSession";
import { useUserTeams } from "@/hooks/useUserTeams";
import { toast } from "sonner";
import { GameClockManager } from "./GameClockManager";
import { PlayerStatsDisplay } from "./PlayerStatsDisplay";
import { LiveGameInterface } from "./LiveGameInterface";
import { TeamSelector } from "./TeamSelector";
import { LiveStatsTracker } from "./LiveStatsTracker";
import { TeamSelectionPrompt } from "./TeamSelectionPrompt";

interface LiveGamePlayByPlayProps {
  canEdit: boolean;
}

interface LivePlayerStat {
  playerId: string;
  playerName: string;
  position: string;
  completions: number;
  interceptions: number;
  tdPass: number;
  tdRun: number;
  extraPoint1: number;
  extraPoint2: number;
  receptions: number;
  runs: number;
  touchdowns: number;
  fumbles: number;
  defensiveInterceptions: number;
  sacks: number;
  pick6: number;
  flagPulls: number;
  safeties: number;
  totalPoints: number;
  lastAction?: string;
  lastActionTime?: string;
}

export const LiveGamePlayByPlay = ({ canEdit }: LiveGamePlayByPlayProps) => {
  const {
    gameSession,
    createGameSession,
    endGameSession,
    isLoading,
  } = useGameSession();
  const { teams, isLoading: teamsLoading } = useUserTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [livePlayerStats, setLivePlayerStats] = useState<LivePlayerStat[]>([]);
  const [playerStats] = useState([]);

  const selectedTeam = teams.find((team) => team.id === selectedTeamId);
  const canStartGame = selectedTeamId && !!selectedTeam;
  const canManageGame =
    canEdit ||
    (selectedTeam &&
      (selectedTeam.userRole === "creator" ||
        selectedTeam.roleDetails?.includes("Coach") ||
        selectedTeam.roleDetails?.includes("Head Coach")));

  const homeTeam = {
    name: selectedTeam?.name || "Home Team",
    score: homeScore,
  };
  const awayTeam = {
    name: "Away Team",
    score: awayScore,
  };

  const updateScore = (team: "home" | "away", points: number) => {
    if (team === "home") {
      setHomeScore((prev) => prev + points);
    } else {
      setAwayScore((prev) => prev + points);
    }
  };

  const startGame = async () => {
    if (!canStartGame) {
      toast.error("Please select a team first");
      return;
    }

    try {
      const sessionData = {
        event_id: "temp-event-id",
        team_id: selectedTeamId,
        team_side: "home" as const,
        current_quarter: 1,
      };

      await createGameSession(sessionData);
      setIsGameActive(true);
      toast.success(`Flag football game started for ${selectedTeam?.name}!`);
    } catch (error) {
      console.error("Error starting game:", error);
      toast.error("Failed to start flag football game");
    }
  };

  const pauseGame = () => {
    toast.info("Flag football game paused");
  };

  const undoLastAction = () => {
    const recentPlayer = livePlayerStats.find((p) => p.lastAction);
    if (recentPlayer) {
      setLivePlayerStats((prev) =>
        prev.map((player) =>
          player.playerId === recentPlayer.playerId
            ? { ...player, lastAction: undefined, lastActionTime: undefined }
            : player
        )
      );
      toast.success("Last flag football action undone");
    } else {
      toast.error("No action to undo");
    }
  };

  const endGame = async () => {
    if (!gameSession) {
      setIsGameActive(false);
      toast.success(`Flag football game ended for ${selectedTeam?.name}!`);
      return;
    }

    try {
      await endGameSession(gameSession.id);
      setIsGameActive(false);
      toast.success(`Flag football game ended for ${selectedTeam?.name}!`);
    } catch (error) {
      console.error("Error ending game:", error);
      toast.error("Failed to end flag football game");
    }
  };

  if (teamsLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blitz-purple'></div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Team Selection */}
      <TeamSelector
        teams={teams}
        selectedTeamId={selectedTeamId}
        onTeamSelect={setSelectedTeamId}
        userRole={
          typeof selectedTeam?.roleDetails === "string"
            ? selectedTeam.roleDetails
            : selectedTeam?.userRole
        }
      />

      {/* Team Selection Prompt */}
      <TeamSelectionPrompt shouldShow={!selectedTeamId && teams.length > 1} />

      {/* Live Game Tabs */}
      {selectedTeamId && (
        <Tabs defaultValue='live-interface' className='space-y-4'>
          <TabsList className='grid w-full grid-cols-3 bg-blitz-darkgray h-12'>
            <TabsTrigger
              value='live-interface'
              className='flex items-center justify-center text-xs data-[state=active]:bg-blitz-purple'
            >
              <Gamepad2 size={14} className='mr-1' />
              <span>Live</span>
            </TabsTrigger>
            <TabsTrigger
              value='referee-view'
              className='flex items-center justify-center text-xs data-[state=active]:bg-blitz-purple'
            >
              <Clock size={14} className='mr-1' />
              <span>Referee</span>
            </TabsTrigger>
            <TabsTrigger
              value='player-stats'
              className='flex items-center justify-center text-xs data-[state=active]:bg-blitz-purple'
            >
              <Target size={14} className='mr-1' />
              <span>Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='live-interface' className='mt-4'>
            <LiveGameInterface
              canEdit={canManageGame}
              selectedTeam={selectedTeam}
              isGameActive={isGameActive}
              canManageGame={canManageGame}
              onStartGame={startGame}
              onPauseGame={pauseGame}
              onEndGame={endGame}
              onUndo={undoLastAction}
            />
          </TabsContent>

          <TabsContent value='referee-view' className='mt-4'>
            <GameClockManager
              isGameActive={isGameActive}
              onStartGame={startGame}
              onPauseGame={pauseGame}
              onUndoAction={undoLastAction}
              onEndGame={endGame}
              canEdit={canManageGame}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              onUpdateScore={updateScore}
            />
          </TabsContent>

          <TabsContent value='player-stats' className='mt-4'>
            <div>
              <h3 className='text-lg font-bold mb-3 flex items-center space-x-2'>
                <Flag className='text-blitz-purple' size={18} />
                <span>Player Stats - {selectedTeam?.name}</span>
              </h3>
              <PlayerStatsDisplay players={playerStats} />
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Live Stats Tracker */}
      <LiveStatsTracker
        selectedTeam={selectedTeam}
        isGameActive={isGameActive}
        livePlayerStats={livePlayerStats}
      />
    </div>
  );
};
