/**
 * 비밀번호 재설정 관련 커스텀 훅
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";

export function useResetPassword() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 비밀번호 찾기 (이메일 발송)
   */
  const forgotPassword = async (email: string) => {
    setError("");
    setIsLoading(true);

    try {
      console.log("Requesting password reset for:", email);
      
      const result = await authService.forgotPassword({ email });
      
      console.log("Forgot password response:", result);
      
      return { success: true, data: result };
    } catch (err: any) {
      console.error("Forgot password error:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        response: err.response?.data,
      });

      let errorMessage = "비밀번호 재설정 요청 중 오류가 발생했습니다.";

      // 백엔드 에러 응답 구조 확인
      if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 비밀번호 재설정
   */
  const resetPassword = async (token: string, newPassword: string, username?: string) => {
    setError("");
    setIsLoading(true);

    try {
      console.log("Resetting password with token:", token?.substring(0, 20) + "...");
      if (username) {
        console.log("Test mode for username:", username);
      }
      
      await authService.resetPassword({
        token,
        new_password: newPassword,
        username,
      });

      console.log("Password reset successful");

      // 성공 시 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push("/signin");
      }, 3000);

      return { success: true };
    } catch (err: any) {
      console.error("Reset password error:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        response: err.response?.data,
      });

      let errorMessage = "비밀번호 재설정 중 오류가 발생했습니다.";

      // 백엔드 에러 응답 구조 확인
      if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // 에러 코드별 처리
      if (err.code === "VALIDATION_ERROR" || err.response?.data?.error?.code === "VALIDATION_ERROR") {
        errorMessage = "유효하지 않거나 만료된 토큰입니다.";
      } else if (err.code === "TOKEN_EXPIRED" || err.response?.data?.error?.code === "TOKEN_EXPIRED") {
        errorMessage = "토큰이 만료되었습니다. 비밀번호 찾기를 다시 진행해주세요.";
      } else if (err.code === "INVALID_TOKEN" || err.response?.data?.error?.code === "INVALID_TOKEN") {
        errorMessage = "유효하지 않은 토큰입니다. 링크를 다시 확인해주세요.";
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
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
    isLoading,
    error,

    // Actions
    forgotPassword,
    resetPassword,
    clearError,
  };
}
