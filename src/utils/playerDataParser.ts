import { ParsedPlayer } from "@/types/bulkImportTypes";

export const parsePlayerData = (data: string): ParsedPlayer[] => {
  const lines = data.trim().split("\n");
  const players: ParsedPlayer[] = [];

  lines.forEach((line, index) => {
    if (index === 0) {
      console.log("Skipping header row:", line);
      return; // Skip header row
    }

    // Handle both tab-separated and comma-separated data
    let columns: string[];
    if (line.includes("\t")) {
      columns = line.split("\t").map((col) => col.trim());
    } else {
      columns = line.split(",").map((col) => col.trim());
    }

    if (columns.length >= 3 && columns[0] && columns[1]) {
      // Ensure we have at least first name, last name, and jersey number
      const playerFirstName = columns[0] || "";
      const playerLastName = columns[1] || "";
      const jerseyNumber = columns[2] || "";
      const guardianEmail = columns[3] || "";
      const guardianFirstName = columns[4] || "";
      const guardianLastName = columns[5] || "";

      const player: ParsedPlayer = {
        jerseyNumber,
        teamName: "", // Will be set by team context
        division: "U12", // Default division, can be changed
        season: "2025", // Default season
        playerName: `${playerFirstName} ${playerLastName}`.trim(),
        guardianName: `${guardianFirstName} ${guardianLastName}`.trim(),
        guardianEmail,
        guardianPhone: "", // Not provided in new format
      };

      players.push(player);
    }
  });

  return players;
};
