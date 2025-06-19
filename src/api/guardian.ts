import apiClient from "./client";

const API_ENDPOINTS = {
  guardians: "/player-guardian-relation",
};

export const guardianApi = {
  getGuardians: async () => {
    const response = await apiClient.get(API_ENDPOINTS.guardians);
    return response.data.data;
  },

  addGuardian: async (guardianEmail: string) => {
    const response = await apiClient.post(API_ENDPOINTS.guardians, {
      guardianEmail,
    });
    return response.data.data;
  },

  removeGuardian: async (relationshipId: string) => {
    await apiClient.delete(`${API_ENDPOINTS.guardians}/${relationshipId}`);
  },
};
