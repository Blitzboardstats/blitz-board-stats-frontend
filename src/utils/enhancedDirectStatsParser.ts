
import { ProcessedPlayerStats } from '@/types/bulkStatsTypes';
import { Player } from '@/types/playerTypes';

export interface GameStatsData {
  opponent: string;
  gameDate: string;
  gameType: 'regular' | 'playoff' | 'tournament';
  isHomeGame: boolean;
  quarter: number;
}

export const parseDirectStatsWithJerseyMatch = (
  data: string, 
  teamPlayers: Player[], 
  gameInfo?: GameStatsData
): ProcessedPlayerStats[] => {
  const lines = data.trim().split('\n');
  const headers = lines[0].split('\t');
  
  console.log('Parsing direct stats data with jersey matching, headers:', headers);
  console.log('Available team players:', teamPlayers);
  
  const stats: ProcessedPlayerStats[] = [];
  
  // Skip header row and Grand Total row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes('Grand Total')) break;
    
    const values = line.split('\t');
    if (values.length < 2) continue;
    
    const jerseyNumber = values[0]?.trim();
    if (!jerseyNumber) continue;
    
    console.log(`Processing player with jersey ${jerseyNumber}, values:`, values);
    
    // Try to find matching player by jersey number
    const matchingPlayer = teamPlayers.find(p => 
      p.jersey_number === jerseyNumber || 
      p.jersey_number === `#${jerseyNumber}` ||
      p.jersey_number?.replace('#', '') === jerseyNumber
    );
    
    // Parse the stats according to the column order
    const qbCompletions = parseInt(values[1]) || 0;
    const qbTouchdowns = parseInt(values[2]) || 0;
    const runs = parseInt(values[3]) || 0;
    const receptions = parseInt(values[4]) || 0;
    const playerTdPoints = parseInt(values[5]) || 0;
    const qbTdPoints = parseInt(values[6]) || 0;
    const extraPoint1 = parseInt(values[7]) || 0;
    const extraPoint2 = parseInt(values[8]) || 0;
    const defInterceptions = parseInt(values[9]) || 0;
    const pick6 = parseInt(values[10]) || 0;
    const safeties = parseInt(values[11]) || 0;
    const flagPulls = parseInt(values[12]) || 0;
    const totalPoints = parseInt(values[13]) || 0;
    
    const playerStats: ProcessedPlayerStats = {
      playerId: matchingPlayer?.id || `temp-player-${jerseyNumber}`,
      playerName: matchingPlayer?.name || `Player #${jerseyNumber}`,
      jerseyNumber,
      guardianEmail: matchingPlayer?.guardian_email || '', // Use existing player data if available
      season: gameInfo ? new Date(gameInfo.gameDate).getFullYear().toString() : '2024',
      division: 'Flag Football',
      gamesPlayed: 1, // Single game import
      totalQbCompletions: qbCompletions,
      totalQbTouchdowns: qbTouchdowns,
      totalRuns: runs,
      totalReceptions: receptions,
      totalPlayerTdPoints: playerTdPoints,
      totalQbTdPoints: qbTdPoints,
      totalExtraPoint1: extraPoint1,
      totalExtraPoint2: extraPoint2,
      totalDefInterceptions: defInterceptions,
      totalPick6: pick6,
      totalSafeties: safeties,
      totalFlagPulls: flagPulls,
      totalPoints,
      // Add game-specific data if provided
      ...(gameInfo && {
        gameDate: gameInfo.gameDate,
        opponent: gameInfo.opponent,
        gameType: gameInfo.gameType,
        quarter: gameInfo.quarter
      })
    };
    
    stats.push(playerStats);
  }
  
  console.log('Parsed stats with jersey matching:', stats);
  return stats;
};

export const validateJerseyMatches = (
  data: string, 
  teamPlayers: Player[]
): { matched: string[], unmatched: string[], suggestions: Array<{jersey: string, suggestions: Player[]}> } => {
  const lines = data.trim().split('\n');
  const jerseyNumbers: string[] = [];
  
  // Extract jersey numbers from data
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes('Grand Total')) break;
    
    const values = line.split('\t');
    const jerseyNumber = values[0]?.trim();
    if (jerseyNumber) {
      jerseyNumbers.push(jerseyNumber);
    }
  }
  
  const matched: string[] = [];
  const unmatched: string[] = [];
  const suggestions: Array<{jersey: string, suggestions: Player[]}> = [];
  
  jerseyNumbers.forEach(jersey => {
    const exactMatch = teamPlayers.find(p => 
      p.jersey_number === jersey || 
      p.jersey_number === `#${jersey}` ||
      p.jersey_number?.replace('#', '') === jersey
    );
    
    if (exactMatch) {
      matched.push(jersey);
    } else {
      unmatched.push(jersey);
      
      // Find potential matches based on similar jersey numbers or names
      const potentialMatches = teamPlayers.filter(p => {
        const playerJersey = p.jersey_number?.replace('#', '') || '';
        return playerJersey.includes(jersey) || jersey.includes(playerJersey);
      });
      
      suggestions.push({
        jersey,
        suggestions: potentialMatches.slice(0, 3) // Limit to 3 suggestions
      });
    }
  });
  
  return { matched, unmatched, suggestions };
};
