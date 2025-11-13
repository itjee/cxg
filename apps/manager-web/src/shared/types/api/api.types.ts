// API-related types

export interface ApiError extends Error {
  code?: string;
  status?: number;
  detail?: Record<string, unknown>;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
}
