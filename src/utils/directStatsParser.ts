
import { ProcessedPlayerStats } from '@/types/bulkStatsTypes';

export const parseDirectStatsData = (data: string): ProcessedPlayerStats[] => {
  const lines = data.trim().split('\n');
  const headers = lines[0].split('\t');
  
  console.log('Parsing direct stats data, headers:', headers);
  
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
      playerId: `temp-player-${jerseyNumber}`, // Temporary ID for jersey number
      playerName: `Player #${jerseyNumber}`, // Default name using jersey number
      jerseyNumber,
      guardianEmail: '', // Not provided in this data format
      season: '2024',
      division: 'Flag Football',
      gamesPlayed: 1, // Default to 1 since we don't have this data
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
      totalPoints
    };
    
    stats.push(playerStats);
  }
  
  console.log('Parsed stats:', stats);
  return stats;
};
