
// Flag Football specific types and metrics
export interface FlagFootballAction {
  id: string;
  type: FlagActionType;
  playerId: string;
  quarter: 1 | 2 | 3 | 4 | 5;
  side: 'offense' | 'defense';
  points: number;
  timestamp: string;
}

export type FlagActionType = 
  // Offensive Actions
  | 'completion'
  | 'touchdown'
  | 'run'
  | 'reception'
  | 'fumble'
  | 'interception_thrown'
  | 'extra_point_1'
  | 'extra_point_2'
  | 'td_pass'
  | 'td_run'
  
  // Defensive Actions
  | 'flag_pull'
  | 'sack'
  | 'interception'
  | 'pick_6'
  | 'safety';

export interface FlagFootballPlayerStats {
  playerId: string;
  playerName: string;
  position: string;
  
  // QB Specific Stats
  completions: number;
  interceptions: number;
  tdPass: number;
  tdRun: number;
  extraPoint1: number;
  extraPoint2: number;
  
  // Offensive Player Stats
  receptions: number;
  runs: number;
  touchdowns: number;
  fumbles: number;
  
  // Defensive Stats (Flag Football Specific)
  defensiveInterceptions: number;
  sacks: number;
  pick6: number;
  flagPulls: number; // This is Flag specific - replaces tackles
  safeties: number;
  
  totalPoints: number;
}

export interface FlagFootballGameSession {
  id: string;
  event_id: string;
  team_id: string;
  team_side: 'home' | 'away';
  current_quarter: 1 | 2 | 3 | 4 | 5;
  is_active: boolean;
  sport_type: 'flag_football';
  start_time: string;
  end_time?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
