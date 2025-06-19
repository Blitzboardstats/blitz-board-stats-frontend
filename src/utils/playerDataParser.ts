
import { ParsedPlayer } from '@/types/bulkImportTypes';

export const parsePlayerData = (data: string): ParsedPlayer[] => {
  const lines = data.trim().split('\n');
  const players: ParsedPlayer[] = [];
  
  lines.forEach((line, index) => {
    if (index === 0) return; // Skip header row
    
    const columns = line.split('\t').map(col => col.trim());
    
    if (columns.length >= 6 && columns[5]) { // Ensure we have at least player name
      players.push({
        jerseyNumber: columns[0] || '',
        teamName: columns[1] || '',
        division: columns[2] || '',
        season: columns[3] || '',
        playerName: columns[5] || '',
        guardianName: columns[6] || '',
        guardianEmail: columns[7] || '',
        guardianPhone: columns[8] || ''
      });
    }
  });
  
  return players;
};
