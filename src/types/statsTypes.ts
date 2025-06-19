
export interface TeamStats {
  teamId: string;
  teamName: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  pointsScored: number;
  pointsAllowed: number;
  winPercentage: number;
  averagePointsScored: number;
  averagePointsAllowed: number;
  season: string;
}

export interface PlayerSeasonStats {
  playerId: string;
  playerName: string;
  playerNumber: string;
  position: string;
  teamId: string;
  teamName: string;
  guardianEmail?: string; // Added for permission checks
  guardianName?: string;  // Added for display
  gamesPlayed: number;
  
  // Offensive Stats
  touchdowns: number;
  rushingYards: number;
  passingYards: number;
  receptions: number;
  completions: number;
  passingAttempts: number;
  completionPercentage: number;
  interceptionsThrown: number;
  fumbles: number;
  
  // Defensive Stats (Flag Football specific)
  tackles: number; // Actually flag pulls in Flag Football
  sacks: number;
  interceptions: number;
  fumbleRecoveries: number;
  passBreakups: number;
  safeties: number;
  
  // Special Stats
  extraPoints: number;
  totalPoints: number;
  season: string;
}

export interface QBStats extends PlayerSeasonStats {
  passingTouchdowns: number;
  rushingTouchdowns: number;
  qbRating: number;
  yardsPerAttempt: number;
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  playerNumber: string;
  teamName: string;
  value: number;
  rank: number;
}

export interface SeasonLeaderboards {
  touchdowns: LeaderboardEntry[];
  passingYards: LeaderboardEntry[];
  rushingYards: LeaderboardEntry[];
  flagPulls: LeaderboardEntry[]; // Changed from tackles to flag pulls for Flag Football
  interceptions: LeaderboardEntry[];
  sacks: LeaderboardEntry[];
}
