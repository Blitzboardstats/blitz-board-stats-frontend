
import { useState, useEffect } from 'react';

interface PlayerJersey {
  id: string;
  name: string;
  number: string;
  position?: string;
  isActive: boolean;
}

interface GameStateProps {
  teamId: string;
}

export const useGameState = ({ teamId }: GameStateProps) => {
  const [homeTeam, setHomeTeam] = useState({ name: "Home", score: 0 });
  const [awayTeam, setAwayTeam] = useState({ name: "Away", score: 0 });
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [gameTime, setGameTime] = useState(15 * 60); // Changed to number (seconds)
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSide, setSelectedSide] = useState<"offense" | "defense">("offense");
  const [activePlayers, setActivePlayers] = useState<PlayerJersey[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const updateScore = (team: "home" | "away", points: number) => {
    if (team === "home") {
      setHomeTeam(prev => ({ ...prev, score: prev.score + points }));
    } else {
      setAwayTeam(prev => ({ ...prev, score: prev.score + points }));
    }
  };

  const handleActivePlayersChange = (players: PlayerJersey[]) => {
    console.log('GameState: Updating active players:', players);
    setActivePlayers(players);
    
    // Only auto-select if we have players and no current selection
    if (players.length > 0 && !selectedPlayer) {
      setSelectedPlayer(players[0].id);
    }
    
    // Clear selection if selected player is no longer in active list
    if (selectedPlayer && !players.find(p => p.id === selectedPlayer)) {
      setSelectedPlayer(players.length > 0 ? players[0].id : null);
    }
  };

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayer(playerId);
  };

  return {
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
  };
};
