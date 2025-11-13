"use client";

/**
 * 인증 초기화 Provider
 * 앱 시작 시 토큰을 확인하고 사용자 세션을 복원합니다
 */

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { getCookie } from "@/lib/utils/cookies";

interface AuthProviderProps {
  children: React.ReactNode;
}

// 인증이 필요한 경로들
const protectedRoutes = [
  "/overview",
  "/adm",
  "/asm",
  "/bim",
  "/com",
  "/csm",
  "/fim",
  "/ivm",
  "/lwm",
  "/psm",
  "/srm",
  "/sys",
];

// 인증된 사용자가 접근하면 안되는 경로들
const authRoutes = ["/signin", "/signup"];

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, setTokens, refreshAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 로그아웃 중인지 확인 (로그아웃 플래그 체크)
        const isLoggingOut =
          sessionStorage.getItem("is_logging_out") === "true";
        if (isLoggingOut) {
          sessionStorage.removeItem("is_logging_out");
          clearAuth();
          setIsInitialized(true);
          return;
        }

        // 쿠키와 localStorage에서 토큰 확인
        const accessToken =
          getCookie("auth-token") || localStorage.getItem("access_token");
        const refreshToken =
          getCookie("refresh_token") || localStorage.getItem("refresh_token");

        if (accessToken && refreshToken) {
          // 토큰이 있으면 스토어에 설정하고 사용자 정보 갱신
          setTokens(accessToken, refreshToken);
          try {
            await refreshAuth();
          } catch (error) {
            console.error("Auth refresh failed during initialization:", error);
            clearAuth();
          }
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

  // 초기화 완료 후 라우팅 처리
  useEffect(() => {
    if (!isInitialized) return;

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // 보호된 라우트인데 인증되지 않은 경우
    if (isProtectedRoute && !isAuthenticated) {
      router.replace(`/signin?from=${pathname}`);
      return;
    }

    // 인증 라우트인데 이미 인증된 경우
    if (isAuthRoute && isAuthenticated) {
      router.replace("/overview");
      return;
    }
  }, [isInitialized, isAuthenticated, pathname, router]);

  // 인증 초기화가 완료될 때까지 로딩 표시
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-300 text-sm">로딩 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
