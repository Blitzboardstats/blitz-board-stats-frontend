import apiClient from "./client";
import { Team } from "@/types/teamTypes";
import { Player } from "@/types/playerTypes";
import { API_ENDPOINTS } from "./config";
import { getErrorResponse } from "@/utils/response";

export const teamApi = {
  createTeam: async (teamData: Partial<Team>): Promise<Team> => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.teams.create,
        teamData
      );
      return response.data.data;
    } catch (error) {
      throw getErrorResponse(error);
    }
  },

  updateTeam: async (
    teamId: string,
    teamData: Partial<Team>
  ): Promise<Team> => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.teams.update(teamId),
        teamData
      );
      return response.data.data;
    } catch (error) {
      throw getErrorResponse(error);
    }
  },

  getTeam: async (teamId: string): Promise<Team> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.teams.get(teamId));
      return response.data.data;
    } catch (error) {
      throw getErrorResponse(error);
    }
  },

  getTeams: async (): Promise<Team[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.teams.list);
      return response.data.data;
    } catch (error) {
      throw getErrorResponse(error);
    }
  },

  deleteTeam: async (teamId: string): Promise<void> => {
    try {
      await apiClient.delete(API_ENDPOINTS.teams.delete(teamId));
    } catch (error) {
      throw getErrorResponse(error);
    }
  },

  getTeamPlayers: async (teamId: string) => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.teams.getPlayers(teamId)
      );
      return response.data.data;
    } catch (error) {
      throw getErrorResponse(error);
    }
  },

  getTeamCoaches: async (teamId: string) => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.teams.getCoaches(teamId)
      );
      return response.data.data;
    } catch (error) {
      throw getErrorResponse(error);
    }
  },

  bulkImportPlayers: async (
    teamId: string,
    players: Omit<Player, "id" | "created_at">[]
  ): Promise<Player[]> => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.teams.bulkImportPlayers(teamId),
        { players }
      );
      return response.data.data;
    } catch (error) {
      throw getErrorResponse(error);
    }
  },
};
