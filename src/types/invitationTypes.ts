export interface TeamInvitation {
  id: string;
  team_id: string;
  email: string;
  invited_by: string;
  invitation_type: "member" | "coach" | "player";
  status: "pending" | "accepted" | "declined" | "expired";
  player_name: string | null;
  coach_role: string | null;
  name: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  team?: {
    name: string;
    football_type: string;
    age_group: string | null;
    season: string | null;
  };
  _id?: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: "admin" | "coach" | "member";
  joined_at: string;
}
