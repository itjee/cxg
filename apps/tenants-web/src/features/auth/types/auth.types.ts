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

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  code: string;
  message: string;
  detail?: Record<string, any>;
}

export interface EnvelopeResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}
