
import { ParsedPlayer } from '@/types/bulkImportTypes';

export const parseSimplePlayerData = (rawData: string): ParsedPlayer[] => {
  const lines = rawData.trim().split('\n');
  const parsedPlayers: ParsedPlayer[] = [];
  const uniquePlayers = new Map<string, ParsedPlayer>();

  // Skip header row and process data
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by tab or comma
    const columns = line.split(/\t|,/).map(col => col.trim().replace(/^["']|["']$/g, ''));
    
    if (columns.length < 3) continue; // Need at least first name, last name, jersey number

    try {
      const firstName = columns[0] || '';
      const lastName = columns[1] || '';
      const jerseyNumber = columns[2] || '';
      
      if (!firstName || !lastName || !jerseyNumber) continue;

      const playerName = `${firstName} ${lastName}`.trim();
      const key = `${playerName}-${jerseyNumber}`; // Use name and jersey as unique key

      // Only add unique players (avoid duplicates)
      if (!uniquePlayers.has(key)) {
        const player: ParsedPlayer = {
          playerName,
          jerseyNumber,
          teamName: '', // Will be set by the team context
          division: 'U12', // Default division, can be changed
          season: '2024', // Default season
          guardianName: '', // Will be filled later if needed
          guardianEmail: '', // Will be filled later if needed
          guardianPhone: '', // Will be filled later if needed
        };

        uniquePlayers.set(key, player);
      }
    } catch (error) {
      console.warn(`Skipping invalid row ${i + 1}:`, error);
    }
  }

  return Array.from(uniquePlayers.values());
};
