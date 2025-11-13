"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/use-auth";

interface SigninFormProps {
  redirectTo?: string;
  onDemoLogin?: () => void;
}

export function SigninForm({ redirectTo, onDemoLogin }: SigninFormProps) {
  const { signin, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signin(email, password, redirectTo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Message */}
      {authError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{authError}</p>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-2">
          이메일
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400 transition-colors group-focus-within:text-indigo-300" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-indigo-300/50 focus:border-indigo-400/50 focus:bg-white/10 focus:shadow-lg focus:shadow-indigo-400/20 transition-all outline-none rounded-xl"
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-indigo-200 mb-2">
            비밀번호
          </label>
          <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
            비밀번호 찾기
          </Link>
        </div>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400 transition-colors group-focus-within:text-indigo-300" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-indigo-300/50 focus:border-indigo-400/50 focus:bg-white/10 focus:shadow-lg focus:shadow-indigo-400/20 transition-all outline-none rounded-xl"
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300 transition-colors"
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
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 rounded border-white/30 bg-white/5 text-indigo-400 focus:ring-2 focus:ring-indigo-400/50 cursor-pointer"
        />
        <label htmlFor="remember" className="text-sm text-indigo-200 cursor-pointer">
          로그인 상태 유지
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed outline-none"
      >
        {isLoading ? (
          <>
            <div className="h-5 w-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></div>
            로그인 중...
          </>
        ) : (
          <>
            로그인
            <ArrowRight className="h-5 w-5 inline-block ml-2" />
          </>
        )}
      </button>

      {/* Demo Login Button */}
      {onDemoLogin && (
        <button
          type="button"
          onClick={onDemoLogin}
          disabled={isLoading}
          className="w-full h-12 px-6 py-3 bg-white/5 border border-white/10 text-indigo-200 hover:border-indigo-400/50 hover:bg-white/10 hover:text-indigo-100 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed outline-none"
        >
          데모 계정으로 체험하기
        </button>
      )}
    </form>
  );
}
