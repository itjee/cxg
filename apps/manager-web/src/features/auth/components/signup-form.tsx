/**
 * 회원가입 폼 컴포넌트
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

export function SignupForm() {
  const { signup, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

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
    setFormData({ ...formData, password });
    checkPasswordStrength(password);
    setValidationError("");
  };

  const validateForm = (): boolean => {
    if (!formData.username || !formData.email || !formData.password) {
      setValidationError("모든 필드를 입력해주세요.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("비밀번호가 일치하지 않습니다.");
      return false;
    }

    if (formData.password.length < 8) {
      setValidationError("비밀번호는 최소 8자 이상이어야 합니다.");
      return false;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setValidationError("비밀번호는 최소 1개의 대문자를 포함해야 합니다.");
      return false;
    }

    if (!/[a-z]/.test(formData.password)) {
      setValidationError("비밀번호는 최소 1개의 소문자를 포함해야 합니다.");
      return false;
    }

    if (!/[0-9]/.test(formData.password)) {
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

    await signup(formData.username, formData.email, formData.password);
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

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Message */}
      {displayError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200/80 shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span className="text-red-600">{displayError}</span>
        </div>
      )}

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username" className="text-neutral-200 font-medium">
          사용자명
        </Label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-violet-400" />
          <Input
            id="username"
            type="text"
            placeholder="admin"
            className="pl-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-neutral-600 focus:border-violet-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-violet-500/20 rounded-xl transition-all"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-neutral-200 font-medium">
          이메일
        </Label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-violet-400" />
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            className="pl-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-neutral-600 focus:border-violet-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-violet-500/20 rounded-xl transition-all"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-neutral-200 font-medium">
          비밀번호
        </Label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-violet-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="최소 8자 이상"
            className="pl-12 pr-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-neutral-600 focus:border-violet-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-violet-500/20 rounded-xl transition-all"
            value={formData.password}
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
        {formData.password && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor()} transition-all`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-neutral-500 w-12">
                {getStrengthText()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-neutral-200 font-medium"
        >
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
          <p
            className={`text-sm flex items-center gap-1 ${
              formData.password === formData.confirmPassword
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            {formData.password === formData.confirmPassword
              ? "비밀번호가 일치합니다"
              : "비밀번호가 일치하지 않습니다"}
          </p>
        )}
      </div>

      {/* Admin Approval Notice */}
      <div className="flex items-start gap-3 p-4 bg-violet-500/10 backdrop-blur-sm rounded-xl border border-violet-500/20 shadow-sm">
        <AlertCircle className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
        <p className="text-lg font-bold text-neutral-300 leading-relaxed">
          계정 신청 후 관리자 승인이 완료되면 사용하실 수 있습니다.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-xl text-lg font-semibold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all hover:scale-[1.02]"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="h-5 w-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            신청 중...
          </>
        ) : (
          "계정 신청하기"
        )}
      </Button>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-neutral-400">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/signin"
            className="text-violet-400 hover:text-violet-300 transition-colors font-semibold"
          >
            로그인
          </Link>
        </p>
      </div>
    </form>
  );
}
