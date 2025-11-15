/**
 * 인증 상태 관리 스토어 (Zustand)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/auth.types";
import { authService } from "../services/auth.service";
import { setCookie, deleteCookie } from "@/lib/utils/cookies";

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  signin: (username: string, password: string) => Promise<void>;
  signup: (
    username: string,
    email: string,
    password: string,
    fullName?: string
  ) => Promise<void>;
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
      signin: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
          const tokenData = await authService.signin({ username, password });

          // 토큰 저장 (localStorage + Cookie)
          localStorage.setItem("access_token", tokenData.accessToken);
          localStorage.setItem("refresh_token", tokenData.refreshToken);
          setCookie("access_token", tokenData.accessToken, 7);
          setCookie("refresh_token", tokenData.refreshToken, 7);

          set({
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            isAuthenticated: true,
          });

          // 사용자 정보 조회
          const user = await authService.getCurrentUser();
          set({ user });
        } catch (error) {
          console.error("Signin failed:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // 회원가입
      signup: async (
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
            fullName,
          });

          // 회원가입 후 자동 로그인
          await get().signin(username, password);
        } catch (error) {
          console.error("Signup failed:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // 로그아웃
      logout: async () => {
        try {
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
          localStorage.setItem("access_token", tokenData.accessToken);
          localStorage.setItem("refresh_token", tokenData.refreshToken);
          setCookie("access_token", tokenData.accessToken, 7);
          setCookie("refresh_token", tokenData.refreshToken, 7);

          set({
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
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
        setCookie("access_token", accessToken, 7);
        setCookie("refresh_token", refreshToken, 7);
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      // 인증 정보 초기화
      clearAuth: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        deleteCookie("access_token");
        deleteCookie("refresh_token");
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
