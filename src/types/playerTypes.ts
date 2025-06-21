export interface Player {
  id: string;
  teamId: string;
  name: string;
  position?: string;
  jerseyNumber?: string;
  guardianName?: string;
  guardianEmail?: string;
  photoUrl?: string;
  graduationYear?: number;
  recruitProfile?: string;
  stats?: PlayerStats;
  createdAt: Date | string;
  userId?: string;
  teamRelationships?: PlayerTeamRelationship[];
}

export interface PlayerStats {
  id?: string;
  playerId?: string;
  gamesPlayed?: number;
  touchdowns?: number;
  tackles?: number;
  catches?: number;
  yards?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  [key: string]: number | string | Date | undefined;
}

export interface PlayerTeamRelationship {
  id: string;
  playerId: string;
  teamId: string;
  joinedAt: string;
  leftAt?: string;
  status: "active" | "inactive" | "transferred";
  createdAt: string;
  updatedAt: string;
  team?: {
    id: string;
    name: string;
    footballType: string;
    ageGroup?: string;
    season?: string;
  };
}
