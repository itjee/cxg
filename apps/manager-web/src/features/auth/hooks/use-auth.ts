/**
 * 인증 관련 커스텀 훅
 * Feature-driven 아키텍처에 따른 재사용 가능한 로직 계층
 *
 * 두 가지 방식 제공:
 * 1. useAuth() - 권장 방식 (UI Logic Hook)
 *    - 컴포넌트에서 간단하게 사용
 *    - 글로벌 상태 유지
 *    - 라우팅 자동 처리
 *
 * 2. useSignin(), useSignup() 등 (Apollo Hooks - 고급 사용)
 *    - Apollo Client를 직접 사용
 *    - 로컬 상태만 관리
 *    - 토큰/라우팅 직접 처리 필요
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { useAuthStore } from "@/features/auth";
import {
  SIGNIN,
  SIGNUP,
  REFRESH_TOKEN,
  LOGOUT,
  CHANGE_PASSWORD,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  GET_CURRENT_USER,
  type SigninVariables,
  type SignupVariables,
  type ChangePasswordVariables,
  type ForgotPasswordVariables,
  type ResetPasswordVariables,
  type GetCurrentUserResponse,
} from "@/features/auth/graphql";

// ============================================
// UI LOGIC HOOKS (권장 방식 - 컴포넌트에서 사용)
// ============================================

/**
 * 로그인, 로그아웃, 회원가입 관련 UI 로직
 * 글로벌 상태 유지 + 라우팅 자동 처리
 *
 * @example
 * const { signin, isLoading, error } = useAuth();
 * await signin(username, password);
 */
export function useAuth() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading: storeLoading,
    signin: storeSignin,
    signup: storeSignup,
    logout: storeLogout,
  } = useAuthStore();

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 로그인 (signin)
   */
  const signin = async (username: string, password: string) => {
    setError("");
    setIsLoading(true);

    try {
      await storeSignin(username, password);
      router.push("/core/dashboard");
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
    fullName?: string
  ) => {
    setError("");
    setIsLoading(true);

    try {
      await storeSignup(username, email, password, fullName);
      router.push("/core/dashboard");
      return true;
    } catch (err: any) {
      console.error("Signup error:", err);

      let errorMessage = "계정 신청 중 오류가 발생했습니다. 다시 시도해주세요.";

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
      router.push("/signin");
      return true;
    } catch (err: any) {
      console.error("Logout error:", err);
      // 에러가 발생해도 로그아웃은 진행
      router.push("/signin");
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
    clearError,
  };
}

// ============================================
// APOLLO CLIENT HOOKS (고급 사용 - 선택사항)
// ============================================

/**
 * Apollo Client를 직접 사용하는 고급 사용자를 위한 Hooks
 *
 * 사용하는 경우:
 * - Real-time 구독 필요
 * - 로컬 상태만 필요
 * - 토큰/라우팅을 직접 처리하고 싶음
 *
 * @example
 * const [signin, { loading, error, data }] = useSignin();
 * const result = await signin({
 *   variables: { input: { username, password } }
 * });
 */

/**
 * 로그인 뮤테이션 (Apollo)
 */
export function useSignin() {
  return useMutation<
    {
      auth: {
        signin: {
          accessToken: string;
          refreshToken: string;
          tokenType: string;
          expiresIn: number;
        };
      };
    },
    SigninVariables
  >(SIGNIN);
}

/**
 * 회원가입 뮤테이션 (Apollo)
 */
export function useSignup() {
  return useMutation<
    {
      auth: {
        signup: {
          id: string;
          username: string;
          email: string;
          fullName: string;
          userType: string;
          status: string;
          createdAt: string;
        };
      };
    },
    SignupVariables
  >(SIGNUP);
}

/**
 * 토큰 갱신 뮤테이션 (Apollo)
 */
export function useRefreshToken() {
  return useMutation<{
    auth: {
      refreshToken: {
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        expiresIn: number;
      };
    };
  }>(REFRESH_TOKEN);
}

/**
 * 로그아웃 뮤테이션 (Apollo)
 */
export function useLogout() {
  return useMutation<{
    auth: {
      logout: {
        message: string;
      };
    };
  }>(LOGOUT);
}

/**
 * 비밀번호 변경 뮤테이션 (Apollo)
 */
export function useChangePassword() {
  return useMutation<
    {
      auth: {
        changePassword: {
          message: string;
        };
      };
    },
    ChangePasswordVariables
  >(CHANGE_PASSWORD);
}

/**
 * 비밀번호 찾기 뮤테이션 (Apollo)
 */
export function useForgotPassword() {
  return useMutation<
    {
      auth: {
        forgotPassword: {
          message: string;
          resetToken?: string;
        };
      };
    },
    ForgotPasswordVariables
  >(FORGOT_PASSWORD);
}

/**
 * 비밀번호 재설정 뮤테이션 (Apollo)
 */
export function useResetPassword() {
  return useMutation<
    {
      auth: {
        resetPassword: {
          message: string;
        };
      };
    },
    ResetPasswordVariables
  >(RESET_PASSWORD);
}

/**
 * 현재 사용자 정보 조회 쿼리 (Apollo)
 */
export function useCurrentUser(options = {}) {
  return useQuery<GetCurrentUserResponse>(GET_CURRENT_USER, {
    fetchPolicy: "network-only",
    ...options,
  });
}
