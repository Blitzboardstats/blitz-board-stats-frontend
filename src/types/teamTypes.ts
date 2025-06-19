import { Player } from "./playerTypes";

export interface Team {
  id?: string;
  name: string;
  footballType: "tackle" | "flag";
  ageGroup?: string;
  season?: string;
  coach_id?: string;
  created_by?: string;
  photo_url?: string;
  logo_url?: string;
  wins?: number;
  losses?: number;
  draws?: number;
  created_at?: string;
  players?: Player[];
  numberOfPlayers?: number;
  isCreator?: boolean;
  _id?: string;
}

export interface EventTeam {
  id: string;
  event_id: string;
  team_id: string;
  created_at: string;
}

export interface TeamCoach {
  id: string;
  team_id: string;
  name: string;
  email?: string;
  phone?: string;
  is_head_coach?: boolean; // Deprecated but kept for backward compatibility
  role: "Head Coach" | "Assistant Coach" | "Statistician" | "Team Manager";
  user_id?: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  joined_at: string;
  display_name?: string;
  email?: string;
}

export interface PlayerTeamRelationship {
  id: string;
  player_id: string;
  team_id: string;
  joined_at: string;
  left_at?: string;
  status: "active" | "inactive" | "transferred";
  created_at: string;
  updated_at: string;
}

// Re-export Player type for components that import it from teamTypes
export type { Player };
