/**
 * 비밀번호 재설정 폼 컴포넌트
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "../hooks/use-reset-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Lock,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const { resetPassword, isLoading, error } = useResetPassword();

  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    username: "", // 테스트용
  });
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationError, setValidationError] = useState("");
  const [testMode, setTestMode] = useState(false); // admin 테스트 모드

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const usernameParam = searchParams.get("username");
    
    console.log("Token from URL:", tokenParam);
    console.log("Username from URL:", usernameParam);
    
    if (tokenParam) {
      setToken(tokenParam);
      console.log("Token set successfully, length:", tokenParam.length);
    }
    
    // admin 테스트 모드 활성화
    if (usernameParam === "admin") {
      setTestMode(true);
      setFormData(prev => ({ ...prev, username: "admin" }));
      setToken("test-mode"); // 더미 토큰
      console.log("Admin test mode activated");
    } else if (!tokenParam) {
      console.error("No token in URL parameters");
      setValidationError("유효하지 않은 재설정 링크입니다.");
    }
  }, [searchParams]);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, newPassword: password });
    checkPasswordStrength(password);
    setValidationError("");
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "약함";
    if (passwordStrength <= 3) return "보통";
    return "강함";
  };

  const validateForm = (): boolean => {
    // admin 테스트 모드는 토큰 검증 생략
    if (!testMode && !token) {
      setValidationError("유효하지 않은 재설정 링크입니다.");
      return false;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      setValidationError("모든 필드를 입력해주세요.");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError("비밀번호가 일치하지 않습니다.");
      return false;
    }

    if (formData.newPassword.length < 8) {
      setValidationError("비밀번호는 최소 8자 이상이어야 합니다.");
      return false;
    }

    if (!/[A-Z]/.test(formData.newPassword)) {
      setValidationError("비밀번호는 최소 1개의 대문자를 포함해야 합니다.");
      return false;
    }

    if (!/[a-z]/.test(formData.newPassword)) {
      setValidationError("비밀번호는 최소 1개의 소문자를 포함해야 합니다.");
      return false;
    }

    if (!/[0-9]/.test(formData.newPassword)) {
      setValidationError("비밀번호는 최소 1개의 숫자를 포함해야 합니다.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!validateForm()) {
      return;
    }

    const result = await resetPassword(
      token, 
      formData.newPassword,
      testMode ? formData.username : undefined
    );

    if (result.success) {
      setSuccess(true);
    }
  };

  const displayError = validationError || error;

  if (success) {
    return (
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 bg-green-600/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          비밀번호가 재설정되었습니다
        </h2>

        <p className="text-neutral-300 mb-8">
          새로운 비밀번호로 로그인해주세요.<br />
          잠시 후 로그인 페이지로 이동합니다.
        </p>

        <Link href="/signin">
          <Button className="w-full h-12 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-xl font-semibold">
            지금 로그인하기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-br from-white via-neutral-100 to-neutral-200 bg-clip-text text-transparent mb-2">
          비밀번호 재설정
        </h2>
        <p className="text-neutral-300">
          새로운 비밀번호를 입력해주세요
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Admin Test Mode Banner */}
        {testMode && (
          <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🧪</span>
              <p className="text-sm text-amber-400 font-semibold">Admin 테스트 모드</p>
            </div>
            <p className="text-xs text-amber-300">
              admin 계정은 토큰 검증 없이 비밀번호를 변경할 수 있습니다.
            </p>
          </div>
        )}

        {/* Token Debug Info (Development Only) */}
        {process.env.NODE_ENV === "development" && token && !testMode && (
          <div className="p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
            <p className="text-xs text-violet-400 mb-1 font-semibold">🔧 개발 정보</p>
            <p className="text-xs text-neutral-400">토큰 길이: {token.length}자</p>
            <p className="text-xs text-neutral-400 font-mono break-all mt-1">
              {token.substring(0, 40)}...
            </p>
          </div>
        )}

        {/* Error Message */}
        {displayError && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200/80 shadow-sm">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-600">{displayError}</span>
          </div>
        )}

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-neutral-200 font-medium text-sm">
            새 비밀번호
          </Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-violet-400" />
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="최소 8자 이상"
              className="pl-12 pr-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-neutral-600 focus:border-violet-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-violet-500/20 rounded-xl transition-all"
              value={formData.newPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-violet-400 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {formData.newPassword && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthColor()} transition-all`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-neutral-500 w-12">{getStrengthText()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-neutral-200 font-medium text-sm">
            비밀번호 확인
          </Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-violet-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="비밀번호를 다시 입력하세요"
              className="pl-12 pr-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-neutral-600 focus:border-violet-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-violet-500/20 rounded-xl transition-all"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                setValidationError("");
              }}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-violet-400 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {formData.confirmPassword && (
            <p className={`text-xs flex items-center gap-1 ${formData.newPassword === formData.confirmPassword ? "text-green-600" : "text-red-600"}`}>
              <CheckCircle2 className="h-3 w-3" />
              {formData.newPassword === formData.confirmPassword ? "비밀번호가 일치합니다" : "비밀번호가 일치하지 않습니다"}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all hover:scale-[1.02]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              재설정 중...
            </>
          ) : (
            "비밀번호 재설정"
          )}
        </Button>
      </form>

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <Link
          href="/signin"
          className="text-neutral-400 text-sm hover:text-white transition-colors"
        >
          로그인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
