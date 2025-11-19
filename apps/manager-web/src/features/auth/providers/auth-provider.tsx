"use client";

/**
 * 인증 초기화 Provider
 * 앱 시작 시 토큰을 확인하고 사용자 세션을 복원합니다
 */

import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { getCookie } from "@/lib/utils/cookies";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { setTokens, refreshAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 쿠키에서 토큰 확인
        const accessToken = getCookie("access_token");
        const refreshToken = getCookie("refresh_token");

        if (accessToken && refreshToken) {
          // 토큰이 있으면 스토어에 설정하고 사용자 정보 갱신
          setTokens(accessToken, refreshToken);
          await refreshAuth();
        } else {
          // 토큰이 없으면 인증 상태 초기화
          clearAuth();
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        clearAuth();
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [setTokens, refreshAuth, clearAuth]);

  // 인증 초기화가 완료될 때까지 로딩 표시 (선택사항)
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400 text-base">로딩 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
