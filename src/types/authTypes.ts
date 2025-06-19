
import { Session } from '@supabase/supabase-js';
import { User, UserRole } from '@/types/userTypes';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCoach: boolean;
  error?: string | null;
  retry?: () => void;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, role?: UserRole, metadata?: any) => Promise<void>;
  updateProfile: (user: Partial<User>) => Promise<void>;
}

export type AuthContextValue = AuthState & AuthActions;
