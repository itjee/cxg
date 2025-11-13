/**
 * 인증 API 서비스
 * Feature-driven 아키텍처에 따른 API 통신 계층
 */

import { api } from "@/lib/api";
import type {
  SigninRequest,
  SignupRequest,
  TokenResponse,
  User,
} from "../types/auth.types";

export const authService = {
  /**
   * 로그인 (signin)
   */
  async signin(data: SigninRequest): Promise<TokenResponse> {
    const formData = new URLSearchParams();
    formData.append("username", data.username);
    formData.append("password", data.password);

    const response = await api.post<TokenResponse>("/auth/signin", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  },

  /**
   * 회원가입 (signup)
   */
  async signup(data: SignupRequest): Promise<User> {
    const response = await api.post<User>("/auth/signup", data);
    return response.data;
  },

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  /**
   * 토큰 갱신
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  /**
   * 비밀번호 변경
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await api.post("/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};
