
export interface GameSession {
  id: string;
  event_id: string;
  team_id: string;
  team_side: 'home' | 'away';
  current_quarter: 1 | 2 | 3 | 4 | 5;
  is_active: boolean;
  start_time: string;
  end_time?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface QuarterRoster {
  id: string;
  game_session_id: string;
  player_id: string;
  quarter: 1 | 2 | 3 | 4 | 5;
  is_active: boolean;
  created_at: string;
}

export interface LiveStatAction {
  id: string;
  game_session_id: string;
  player_id: string;
  quarter: 1 | 2 | 3 | 4 | 5;
  side: 'offense' | 'defense';
  action_type: string;
  points: number;
  timestamp: string;
  created_at: string;
}

export interface PlayerJersey {
  id: string;
  number: string;
  name: string;
  position?: string;
  isActive: boolean;
}

export interface TeamScore {
  quarter1: number;
  quarter2: number;
  quarter3: number;
  quarter4: number;
  overtime?: number;
  total: number;
}
