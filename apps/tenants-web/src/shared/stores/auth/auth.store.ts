/**
 * 인증 상태 관리 스토어 (Zustand)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/features/auth/types/auth.types";
import { authService } from "@/features/auth/services/auth.service";
import { setCookie, deleteCookie } from "@/lib/utils/cookies";

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // 로그인
      login: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
          const tokenData = await authService.signin({ username, password });

          // 토큰 저장 (localStorage + Cookie)
          localStorage.setItem("access_token", tokenData.access_token);
          localStorage.setItem("refresh_token", tokenData.refresh_token);
          setCookie("auth-token", tokenData.access_token, 7);
          setCookie("refresh_token", tokenData.refresh_token, 7);

          set({
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            isAuthenticated: true,
          });

          // 사용자 정보 조회
          const user = await authService.getCurrentUser();
          set({ user });
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // 회원가입
      register: async (
        username: string,
        email: string,
        password: string,
        fullName?: string
      ) => {
        set({ isLoading: true });
        try {
          await authService.signup({
            username,
            email,
            password,
            ...(fullName && { full_name: fullName }),
          });

          // 회원가입 후 자동 로그인
          await get().login(username, password);
        } catch (error) {
          console.error("Registration failed:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // 로그아웃
      logout: async () => {
        try {
          // 로그아웃 플래그 설정 (AuthProvider가 토큰을 다시 로드하지 않도록)
          if (typeof window !== "undefined") {
            sessionStorage.setItem("is_logging_out", "true");
          }
          await authService.logout();
        } catch (error) {
          console.error("Logout failed:", error);
        } finally {
          // 로컬 상태 초기화
          get().clearAuth();
        }
      },

      // 토큰 갱신
      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().clearAuth();
          return;
        }

        try {
          const tokenData = await authService.refreshToken(refreshToken);

          // 토큰 저장 (localStorage + Cookie)
          localStorage.setItem("access_token", tokenData.access_token);
          localStorage.setItem("refresh_token", tokenData.refresh_token);
          setCookie("auth-token", tokenData.access_token, 7);
          setCookie("refresh_token", tokenData.refresh_token, 7);

          set({
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            isAuthenticated: true,
          });

          // 사용자 정보 갱신
          const user = await authService.getCurrentUser();
          set({ user });
        } catch (error) {
          console.error("Token refresh failed:", error);
          get().clearAuth();
        }
      },

      // 사용자 설정
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      // 토큰 설정
      setTokens: (accessToken: string, refreshToken: string) => {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        setCookie("auth-token", accessToken, 7);
        setCookie("refresh_token", refreshToken, 7);
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      // 인증 정보 초기화
      clearAuth: () => {
        // localStorage 정리
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
        // 쿠키 삭제
        deleteCookie("auth-token");
        deleteCookie("refresh_token");
        // Zustand 상태 초기화
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
