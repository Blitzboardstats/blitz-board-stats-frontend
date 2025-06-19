
export interface TeamInfo {
  team_id: string;
  team_name: string;
  age_group: string;
}

export interface GroupedPlayer {
  player_name: string;
  age_group: string;
  teams: TeamInfo[];
  player_ids: string[];
  players: Array<{
    id: string;
    name: string;
    team_id: string;
    guardian_email: string;
    guardian_name?: string;
    jersey_number?: string;
    position?: string;
    photo_url?: string;
    created_at: string;
  }>;
}

export interface GuardianPlayersGroup {
  guardian_email: string;
  linked_players: GroupedPlayer[];
}
