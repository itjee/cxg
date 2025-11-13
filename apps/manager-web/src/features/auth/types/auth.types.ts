/**
 * 인증 관련 타입 정의
 */

export interface SigninRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

// Backward compatibility
export type LoginRequest = SigninRequest;
export type RegisterRequest = SignupRequest;

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  user_type: string;
  status: string;
  created_at: string;
}

export interface ApiError {
  code: string;
  message: string;
  detail: Record<string, any>;
}

export interface EnvelopeResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}
