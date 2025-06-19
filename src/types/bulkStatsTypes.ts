
export interface ParsedGameStats {
  jerseyNumber: string;
  guardianEmail: string;
  eventType: string;
  homeSquad?: string;
  awaySquad?: string;
  gridironBattle: string;
  division: string;
  matchupFormat: string;
  clubOrganization: string;
  gameCity: string;
  season: string;
  gameNumber: string;
  qbCompletions: number;
  qbTouchdowns: number;
  runs: number;
  receptions: number;
  playerTdPoints: number;
  qbTdPoints: number;
  extraPoint1: number;
  extraPoint2: number;
  defInterceptions: number;
  pick6: number;
  safeties: number;
  flagPulls: number;
  // Additional stats fields that can be expanded
  [key: string]: string | number | undefined;
}

export interface ProcessedPlayerStats {
  playerId: string;
  playerName: string;
  jerseyNumber: string;
  guardianEmail: string;
  // Aggregated totals across all games
  totalQbCompletions: number;
  totalQbTouchdowns: number;
  totalRuns: number;
  totalReceptions: number;
  totalPlayerTdPoints: number;
  totalQbTdPoints: number;
  totalExtraPoint1: number;
  totalExtraPoint2: number;
  totalDefInterceptions: number;
  totalPick6: number;
  totalSafeties: number;
  totalFlagPulls: number;
  totalPoints: number;
  gamesPlayed: number;
  season: string;
  division: string;
}

export interface PlayerSeasonStats {
  id: string;
  playerId: string;
  playerName: string;
  playerNumber: string;
  guardianEmail: string;
  guardianName: string;
  teamId: string;
  season: string;
  qbCompletions: number;
  qbTouchdowns: number;
  runs: number;
  receptions: number;
  playerTdPoints: number;
  qbTdPoints: number;
  extraPoint1: number;
  extraPoint2: number;
  defInterceptions: number;
  pick6: number;
  safeties: number;
  flagPulls: number;
  totalPoints: number;
  gamesPlayed: number;
  createdAt: string;
  updatedAt: string;
}
