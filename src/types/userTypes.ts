import { Session } from "@supabase/supabase-js";

export type UserRole =
  | "parent"
  | "coach"
  | "assistant_coach"
  | "admin"
  | "player"
  | "fan"
  | "referee"
  | "guardian"
  | "statistician";

export interface User {
  jersey_number?: number;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team: string;
  avatar?: string;
  phone?: string;
  phoneNumber?: string; // Keep both for backward compatibility
  display_name?: string;
  isSystemAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCoach: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role?: UserRole
  ) => Promise<void>;
  updateProfile: (user: Partial<User>) => Promise<void>;
}
