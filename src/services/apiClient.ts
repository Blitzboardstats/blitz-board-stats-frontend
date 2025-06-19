
// API client for NestJS backend integration
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  private getAuthToken(): string | null {
    // TODO: Get token from Zustand store or localStorage
    return localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token 
      : null;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData: any) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  // Team endpoints
  async getTeams() {
    return this.request('/teams');
  }

  async getTeam(id: string) {
    return this.request(`/teams/${id}`);
  }

  async createTeam(teamData: any) {
    return this.request('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  }

  // Player endpoints
  async getPlayers(teamId: string) {
    return this.request(`/teams/${teamId}/players`);
  }

  async createPlayer(teamId: string, playerData: any) {
    return this.request(`/teams/${teamId}/players`, {
      method: 'POST',
      body: JSON.stringify(playerData),
    });
  }

  async updatePlayer(playerId: string, updates: any) {
    return this.request(`/players/${playerId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deletePlayer(playerId: string) {
    return this.request(`/players/${playerId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
