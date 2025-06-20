export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
};

export const API_ENDPOINTS = {
  auth: {
    signup: "/auth/signup",
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
  },

  teams: {
    create: "/teams",
    update: (id: string) => `/teams/${id}`,
    get: (id: string) => `/teams/${id}`,
    list: "/teams",
    delete: (id: string) => `/teams/${id}`,
    getPlayers: (id: string) => `/teams/${id}/players`,
    getCoaches: (id: string) => `/teams/${id}/coachs`,
    bulkImportPlayers: (id: string) => `/teams/${id}/players/bulk`,
  },

  teamInvitations: {
    getInvitations: "/teamInvitations",
    sendInvitation: "/teamInvitations/send",
    respondInvitation: "/teamInvitations/respond",
  },

  // Add more endpoint categories as needed
} as const;

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  status: number;
}

// API Error Types
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}
