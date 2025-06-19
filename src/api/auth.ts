/* eslint-disable @typescript-eslint/no-explicit-any */
import { getErrorResponse, getResponseData } from "@/utils/response";
import apiClient from "./client";
import { API_ENDPOINTS } from "./config";
import { User } from "@/types/userTypes";

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  metadata?: Record<string, any>;
}

export enum UserRole {
  PLAYER = "player",
  COACH = "coach",
  GUARDIAN = "guardian",
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: AuthResponseData;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.auth.signup,
        data
      );
      return response.data!;
    } catch (error) {
      throw getErrorResponse(error);
    }
  },

  async login(data: LoginRequest): Promise<AuthResponseData> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.auth.login,
        data
      );
      return getResponseData<AuthResponseData>(response);
    } catch (error) {
      throw getErrorResponse(error);
    }
  },

  async logout(): Promise<void> {
    // await apiClient.post(API_ENDPOINTS.auth.logout, {});
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.auth.refresh,
        { refreshToken }
      );
      return response.data;
    } catch (error) {
      throw getErrorResponse(error);
    }
  },
};
