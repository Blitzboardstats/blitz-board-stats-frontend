/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { Team, TeamCoach } from "@/types/teamTypes";
import { Player } from "@/types/playerTypes";
import { teamApi } from "@/api/team"; // You'll need to create this API client

export interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  players: Player[];
  coaches: TeamCoach[];
  isLoading: boolean;
  error: string | null;
}

export interface TeamActions {
  // Team Operations
  createTeam: (teamData: Partial<Team>) => Promise<Team | null>;
  updateTeam: (teamId: string, teamData: Partial<Team>) => Promise<Team | null>;
  getTeam: (teamId: string) => Promise<Team | null>;
  getTeams: () => Promise<void>;
  deleteTeam: (teamId: string) => Promise<boolean>;

  // Team Detail API
  getTeamPlayers: (teamId: string) => Promise<void>;
  getTeamCoaches: (teamId: string) => Promise<void>;
  bulkImportPlayers: (
    teamId: string,
    players: Omit<Player, "id" | "created_at">[]
  ) => Promise<Player[] | { error: string }>;

  // State Management
  setCurrentTeam: (team: Team | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useTeamStore = create<TeamState & TeamActions>()((set, get) => ({
  // Initial State
  teams: [],
  currentTeam: null,
  players: [],
  coaches: [],
  isLoading: false,
  error: null,

  // Team Operations
  createTeam: async (teamData: Partial<Team>) => {
    set({ isLoading: true, error: null });
    try {
      const newTeam = await teamApi.createTeam(teamData);
      set((state) => ({
        teams: [...state.teams, newTeam],
        isLoading: false,
      }));
      return newTeam;
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to create team";
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  updateTeam: async (teamId: string, teamData: Partial<Team>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTeam = await teamApi.updateTeam(teamId, teamData);
      set((state) => ({
        teams: state.teams.map((team) =>
          team.id === teamId ? updatedTeam : team
        ),
        currentTeam:
          state.currentTeam?.id === teamId ? updatedTeam : state.currentTeam,
        isLoading: false,
      }));
      return updatedTeam;
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to update team";
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  getTeam: async (teamId: string) => {
    set({ isLoading: true, error: null });
    try {
      const team = await teamApi.getTeam(teamId);
      set({ currentTeam: team, isLoading: false });
      return team;
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to fetch team";
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  getTeams: async () => {
    set({ isLoading: true, error: null });
    try {
      const teams = await teamApi.getTeams();
      set({ teams, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to fetch teams";
      set({ error: errorMessage, isLoading: false });
    }
  },

  deleteTeam: async (teamId: string) => {
    set({ isLoading: true, error: null });
    try {
      await teamApi.deleteTeam(teamId);
      set((state) => ({
        teams: state.teams.filter((team) => team.id !== teamId),
        currentTeam:
          state.currentTeam?.id === teamId ? null : state.currentTeam,
        isLoading: false,
      }));
      return true;
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to delete team";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // Team Detail API
  getTeamPlayers: async (teamId: string) => {
    set({ isLoading: true, error: null });
    try {
      const players = await teamApi.getTeamPlayers(teamId);
      set({ players, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to fetch team players";
      set({ error: errorMessage, isLoading: false });
    }
  },

  getTeamCoaches: async (teamId: string) => {
    set({ isLoading: true, error: null });
    try {
      const coaches = await teamApi.getTeamCoaches(teamId);
      set({ coaches, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to fetch team coaches";
      set({ error: errorMessage, isLoading: false });
    }
  },

  bulkImportPlayers: async (
    teamId: string,
    players: Omit<Player, "id" | "created_at">[]
  ): Promise<Player[] | { error: string }> => {
    set({ isLoading: true, error: null });
    try {
      const importedPlayers = await teamApi.bulkImportPlayers(teamId, players);
      set({ isLoading: false });
      return importedPlayers;
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to import players";
      set({ isLoading: false });
      return { error: errorMessage };
    }
  },

  // State Management
  setCurrentTeam: (team) => set({ currentTeam: team }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
