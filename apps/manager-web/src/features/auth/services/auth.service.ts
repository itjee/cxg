/**
 * 인증 API 서비스
 * Feature-driven 아키텍처에 따른 API 통신 계층
 */

import { apiClient } from "@/lib/api/client";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
  EnvelopeResponse,
} from "../types/auth.types";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/reset-password.types";

export const authService = {
  /**
   * 회원가입 (signup)
   */
  async signup(data: RegisterRequest): Promise<User> {
    const response = await apiClient.post<EnvelopeResponse<User>>(
      "/manager/auth/signup",
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || "회원가입에 실패했습니다.");
    }

    return response.data.data;
  },

  /**
   * 로그인 (signin)
   */
  async signin(data: LoginRequest): Promise<TokenResponse> {
    const response = await apiClient.post<EnvelopeResponse<TokenResponse>>(
      "/manager/auth/signin",
      data
    );

    if (!response.data.success || !response.data.data) {
      const error = response.data.error;
      const errorMessage = error?.message || "로그인에 실패했습니다.";

      const err: any = new Error(errorMessage);
      err.code = error?.code;
      err.detail = error?.detail;
      throw err;
    }

    return response.data.data;
  },

  /**
   * 토큰 갱신
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await apiClient.post<EnvelopeResponse<TokenResponse>>(
      "/manager/auth/refresh",
      { refresh_token: refreshToken }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || "토큰 갱신에 실패했습니다.");
    }

    return response.data.data;
  },

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<EnvelopeResponse<User>>(
      "/manager/auth/me"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || "사용자 정보 조회에 실패했습니다.");
    }

    return response.data.data;
  },

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    await apiClient.post("/manager/auth/logout");
  },

  /**
   * 비밀번호 변경
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await apiClient.post("/manager/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  /**
   * 비밀번호 찾기 (이메일로 재설정 링크 발송)
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<EnvelopeResponse<ForgotPasswordResponse>>(
      "/manager/auth/forgot-password",
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.error?.message || "비밀번호 재설정 요청에 실패했습니다."
      );
    }

    return response.data.data;
  },

  /**
   * 비밀번호 재설정
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<EnvelopeResponse<ResetPasswordResponse>>(
      "/manager/auth/reset-password",
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.error?.message || "비밀번호 재설정에 실패했습니다."
      );
    }

    return response.data.data;
  },
};
