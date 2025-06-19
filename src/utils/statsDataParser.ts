
import { ParsedGameStats, ProcessedPlayerStats } from '@/types/bulkStatsTypes';

export const parseStatsData = (rawData: string): ParsedGameStats[] => {
  const lines = rawData.trim().split('\n');
  const parsedStats: ParsedGameStats[] = [];

  // Skip header row and process data
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by tab (TSV format based on your data)
    const columns = line.split('\t').map(col => col.trim().replace(/^["']|["']$/g, ''));
    
    if (columns.length < 25) continue; // Ensure minimum required columns

    try {
      const stats: ParsedGameStats = {
        jerseyNumber: columns[0] || '',
        guardianEmail: columns[1] || '',
        eventType: columns[2] || '',
        homeSquad: columns[3] || undefined,
        awaySquad: columns[4] || undefined,
        gridironBattle: columns[6] || '', // Column 6 is "Select your gridiron battle"
        division: columns[7] || '',
        matchupFormat: columns[8] || '',
        clubOrganization: columns[9] || '',
        gameCity: columns[10] || '',
        season: columns[11] || '',
        gameNumber: columns[12] || '',
        qbCompletions: parseInt(columns[13]) || 0,
        qbTouchdowns: parseInt(columns[14]) || 0,
        runs: parseInt(columns[17]) || 0,
        receptions: parseInt(columns[18]) || 0,
        playerTdPoints: parseInt(columns[21]) || 0,
        qbTdPoints: parseInt(columns[16]) || 0,
        extraPoint1: parseInt(columns[22]) || 0,
        extraPoint2: parseInt(columns[24]) || 0,
        defInterceptions: parseInt(columns[26]) || 0,
        pick6: parseInt(columns[27]) || 0,
        safeties: parseInt(columns[28]) || 0,
        flagPulls: parseInt(columns[30]) || 0,
      };

      // Add any additional columns as dynamic properties
      for (let j = 31; j < columns.length; j++) {
        const value = columns[j];
        if (value && !isNaN(Number(value))) {
          stats[`additionalStat${j - 30}`] = parseInt(value) || 0;
        } else if (value) {
          stats[`additionalField${j - 30}`] = value;
        }
      }

      parsedStats.push(stats);
    } catch (error) {
      console.warn(`Skipping invalid row ${i + 1}:`, error);
    }
  }

  return parsedStats;
};

export const processPlayerStats = (gameStats: ParsedGameStats[]): ProcessedPlayerStats[] => {
  const playerStatsMap = new Map<string, ProcessedPlayerStats>();

  gameStats.forEach(game => {
    // Use only jersey number as the key for matching
    const key = game.jerseyNumber;
    
    if (playerStatsMap.has(key)) {
      const existing = playerStatsMap.get(key)!;
      existing.totalQbCompletions += game.qbCompletions;
      existing.totalQbTouchdowns += game.qbTouchdowns;
      existing.totalRuns += game.runs;
      existing.totalReceptions += game.receptions;
      existing.totalPlayerTdPoints += game.playerTdPoints;
      existing.totalQbTdPoints += game.qbTdPoints;
      existing.totalExtraPoint1 += game.extraPoint1;
      existing.totalExtraPoint2 += game.extraPoint2;
      existing.totalDefInterceptions += game.defInterceptions;
      existing.totalPick6 += game.pick6;
      existing.totalSafeties += game.safeties;
      existing.totalFlagPulls += game.flagPulls;
      existing.gamesPlayed += 1;
      // Total points will be calculated automatically by the database trigger
      existing.totalPoints = existing.totalPlayerTdPoints + existing.totalQbTdPoints + 
                           existing.totalExtraPoint1 + existing.totalExtraPoint2 + 
                           existing.totalPick6 * 6 + existing.totalSafeties * 2;
    } else {
      playerStatsMap.set(key, {
        playerId: '', // Will be filled when matching with existing players
        playerName: '', // Will be filled when matching with existing players
        jerseyNumber: game.jerseyNumber,
        guardianEmail: game.guardianEmail,
        totalQbCompletions: game.qbCompletions,
        totalQbTouchdowns: game.qbTouchdowns,
        totalRuns: game.runs,
        totalReceptions: game.receptions,
        totalPlayerTdPoints: game.playerTdPoints,
        totalQbTdPoints: game.qbTdPoints,
        totalExtraPoint1: game.extraPoint1,
        totalExtraPoint2: game.extraPoint2,
        totalDefInterceptions: game.defInterceptions,
        totalPick6: game.pick6,
        totalSafeties: game.safeties,
        totalFlagPulls: game.flagPulls,
        totalPoints: game.playerTdPoints + game.qbTdPoints + game.extraPoint1 + game.extraPoint2 + game.pick6 * 6 + game.safeties * 2,
        gamesPlayed: 1,
        season: game.season,
        division: game.division,
      });
    }
  });

  return Array.from(playerStatsMap.values());
};
