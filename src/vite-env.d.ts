/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Request format
interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  metadata?: Record<string, any>;
}

// Response format
interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
