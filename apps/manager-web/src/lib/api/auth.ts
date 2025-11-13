/**
 * 인증 API 클라이언트
 */

import { apiClient } from "./client";

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

export interface UserResponse {
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

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}

/**
 * 회원가입 (signup)
 */
export async function signup(data: SignupRequest): Promise<UserResponse> {
  const response = await apiClient.post<ApiResponse<UserResponse>>("/manager/auth/signup", data);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error?.message || "회원가입에 실패했습니다.");
  }

  return response.data.data;
}

// Backward compatibility
export const register = signup;

/**
 * 로그인 (signin)
 */
export async function signin(data: SigninRequest): Promise<TokenResponse> {
  const response = await apiClient.post<ApiResponse<TokenResponse>>("/manager/auth/signin", data);

  if (!response.data.success || !response.data.data) {
    const error = response.data.error;
    const errorMessage = error?.message || "로그인에 실패했습니다.";

    // 에러 객체에 추가 정보 포함
    const err: any = new Error(errorMessage);
    err.code = error?.code;
    err.detail = error?.detail;
    throw err;
  }

  return response.data.data;
}

// Backward compatibility  
export const login = signin;

/**
 * 토큰 갱신
 */
export async function refreshToken(refreshToken: string): Promise<TokenResponse> {
  const response = await apiClient.post<ApiResponse<TokenResponse>>("/manager/auth/refresh", {
    refresh_token: refreshToken,
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error?.message || "토큰 갱신에 실패했습니다.");
  }

  return response.data.data;
}

/**
 * 현재 사용자 정보 조회
 */
export async function getCurrentUser(): Promise<UserResponse> {
  const response = await apiClient.get<ApiResponse<UserResponse>>("/manager/auth/me");

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error?.message || "사용자 정보 조회에 실패했습니다.");
  }

  return response.data.data;
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  await apiClient.post("/manager/auth/logout");
}

/**
 * 비밀번호 변경
 */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiClient.post("/manager/auth/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
}

/**
 * 비밀번호 찾기 (forgot-password)
 */
export async function forgotPassword(email: string): Promise<ApiResponse<any>> {
  const response = await apiClient.post<ApiResponse<any>>("/manager/auth/forgot-password", {
    email,
  });
  return response.data;
}

/**
 * 비밀번호 재설정 (reset-password)
 */
export async function resetPassword(token: string, newPassword: string): Promise<ApiResponse<any>> {
  const response = await apiClient.post<ApiResponse<any>>("/manager/auth/reset-password", {
    token,
    new_password: newPassword,
  });
  return response.data;
}
