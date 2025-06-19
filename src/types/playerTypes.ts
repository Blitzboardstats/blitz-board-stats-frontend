
export interface Player {
  id: string;
  team_id: string;
  name: string;
  position?: string;
  jersey_number?: string;
  guardian_name?: string;
  guardian_email?: string;
  photo_url?: string;
  graduation_year?: number;
  recruit_profile?: string;
  stats?: PlayerStats;
  created_at: Date | string;
  user_id?: string;
  team_relationships?: PlayerTeamRelationship[];
}

export interface PlayerStats {
  id?: string;
  player_id?: string;
  games_played?: number;
  touchdowns?: number;
  tackles?: number;
  catches?: number;
  yards?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  [key: string]: number | string | Date | undefined;
}

export interface PlayerTeamRelationship {
  id: string;
  player_id: string;
  team_id: string;
  joined_at: string;
  left_at?: string;
  status: 'active' | 'inactive' | 'transferred';
  created_at: string;
  updated_at: string;
  team?: {
    id: string;
    name: string;
    football_type: string;
    age_group?: string;
    season?: string;
  };
}
