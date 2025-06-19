import apiClient from "./client";
import { API_ENDPOINTS } from "./config";

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  invitationType: string;
  coachRole?: string;
  name: string;
  status: "accepted" | "declined" | "pending";
  createdAt: string;
  _id?: string;
}

export const invitationApi = {
  getInvitations: async (): Promise<TeamInvitation[]> => {
    const response = await apiClient.get(
      API_ENDPOINTS.teamInvitations.getInvitations
    );
    return response.data.data;
  },

  sendInvitation: async (payload: {
    teamId: string;
    email: string;
    invitationType: string;
    coachRole?: string;
    name: string;
  }): Promise<TeamInvitation> => {
    const response = await apiClient.post(
      API_ENDPOINTS.teamInvitations.sendInvitation,
      payload
    );
    return response.data.data;
  },

  respondInvitation: async (payload: {
    invitationId: string;
    invitationStatus: "accepted" | "declined";
  }): Promise<TeamInvitation> => {
    const response = await apiClient.put(
      API_ENDPOINTS.teamInvitations.respondInvitation,
      payload
    );
    return response.data.data;
  },
};
