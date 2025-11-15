/**
 * 로그인 폼 컴포넌트
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

export function SigninForm() {
  const { signin, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      return;
    }

    await signin(formData.username, formData.password);
  };

  const handleDemoLogin = () => {
    setFormData({
      ...formData,
      username: "admin",
      password: "Admin1234!",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200/80 shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {/* Username Field */}
      <div className="space-y-2">
        <Label
          htmlFor="username"
          className="text-neutral-200 font-medium text-sm"
        >
          사용자명
        </Label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-violet-400" />
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

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-neutral-200 font-medium text-sm"
          >
            비밀번호
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
          >
            비밀번호 찾기
          </Link>
        </div>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-violet-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-12 pr-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-neutral-600 focus:border-violet-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-violet-500/20 rounded-xl transition-all"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
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
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={formData.remember}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, remember: checked as boolean })
          }
          className="border-white/30 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
        />
        <Label
          htmlFor="remember"
          className="text-sm text-neutral-300 cursor-pointer"
        >
          로그인 상태 유지
        </Label>
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
            로그인 중...
          </>
        ) : (
          "로그인"
        )}
      </Button>

      {/* Demo Login */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 bg-white/5 border border-white/10 text-neutral-300 hover:border-violet-500/50 hover:bg-white/10 hover:text-white rounded-xl font-medium transition-all"
        onClick={handleDemoLogin}
        disabled={isLoading}
      >
        데모 계정으로 시작하기
      </Button>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-neutral-400 text-sm">
          아직 계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="text-violet-400 hover:text-violet-300 transition-colors font-semibold"
          >
            회원가입
          </Link>
        </p>
      </div>

      {/* Demo Info */}
      <div className="p-5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 bg-violet-400 rounded-full animate-pulse"></div>
          <p className="text-xs text-neutral-300 font-semibold uppercase tracking-wide">
            데모 계정 정보
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-violet-400" />
            <span className="font-medium text-neutral-300">사용자명:</span>
            <span className="text-neutral-400">admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-violet-400" />
            <span className="font-medium text-neutral-300">비밀번호:</span>
            <span className="text-neutral-400">Admin1234!</span>
          </div>
        </div>
        {/* Admin Test Links */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-amber-400 mb-2 font-semibold">
              🧪 테스트 링크
            </p>
            <Link
              href="/reset-password?username=admin"
              className="text-xs text-amber-300 hover:text-amber-200 transition-colors block"
            >
              → Admin 비밀번호 재설정 (토큰 불필요)
            </Link>
          </div>
        )}
      </div>
    </form>
  );
}
