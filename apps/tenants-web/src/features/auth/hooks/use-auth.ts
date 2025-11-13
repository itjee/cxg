/**
 * 인증 관련 커스텀 훅
 * Feature-driven 아키텍처에 따른 재사용 가능한 로직 계층
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/shared/stores';

export function useAuth() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading: storeLoading,
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
  } = useAuthStore();

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 로그인 (signin)
   */
  const signin = async (username: string, password: string, redirectTo?: string) => {
    setError("");
    setIsLoading(true);

    try {
      await storeLogin(username, password);
      router.replace(redirectTo || "/overview");
      return true;
    } catch (err: any) {
      console.error("Signin error:", err);

      let errorMessage = "로그인 중 오류가 발생했습니다. 다시 시도해주세요.";

      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      }

      // 에러 코드별 처리
      if (err.code === "AUTHENTICATION_REQUIRED") {
        errorMessage = "사용자명 또는 비밀번호가 일치하지 않습니다.";
      } else if (err.code === "VALIDATION_ERROR") {
        errorMessage = "입력하신 정보를 확인해주세요.";
      }

      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 회원가입 (signup)
   */
  const signup = async (
    username: string,
    email: string,
    password: string,
    fullName?: string,
    redirectTo?: string
  ) => {
    setError("");
    setIsLoading(true);

    try {
      await storeRegister(username, email, password, fullName);
      router.replace(redirectTo || "/overview");
      return true;
    } catch (err: any) {
      console.error("Signup error:", err);

      let errorMessage = "계정 생성 중 오류가 발생했습니다. 다시 시도해주세요.";

      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      }

      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그아웃 (logout)
   */
  const logout = async () => {
    setError("");
    setIsLoading(true);

    try {
      await storeLogout();
      router.replace("/signin");
      return true;
    } catch (err: any) {
      console.error("Logout error:", err);
      // 에러가 발생해도 로그아웃은 진행
      router.replace("/signin");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 데모 로그인
   */
  const demoLogin = async (redirectTo?: string) => {
    setError("");
    setIsLoading(true);

    try {
      // 데모 토큰 설정 (실제 API 호출 없이)
      const demoToken = "demo-token-123";
      localStorage.setItem("access_token", demoToken);
      localStorage.setItem("refresh_token", demoToken);
      
      const { setCookie } = await import("@/lib/utils/cookies");
      setCookie("auth-token", demoToken, 7);
      setCookie("refresh_token", demoToken, 7);
      
      useAuthStore.setState({
        accessToken: demoToken,
        refreshToken: demoToken,
        isAuthenticated: true,
        user: {
          id: 1,
          username: "demo",
          email: "demo@conexgrow.com",
          full_name: "데모 사용자",
          is_active: true,
          is_superuser: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      router.replace(redirectTo || "/overview");
      return true;
    } catch (err: any) {
      console.error("Demo login error:", err);
      setError("데모 로그인 중 오류가 발생했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 에러 초기화
   */
  const clearError = () => {
    setError("");
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || storeLoading,
    error,

    // Actions
    signin,
    signup,
    logout,
    demoLogin,
    clearError,
  };
}
