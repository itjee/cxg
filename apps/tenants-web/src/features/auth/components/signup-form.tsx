"use client";

import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/use-auth";

interface SignupFormProps {
  redirectTo?: string;
}

export function SignupForm({ redirectTo }: SignupFormProps) {
  const { signup, isLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    await signup(
      formData.username,
      formData.email,
      formData.password,
      formData.fullName || undefined,
      redirectTo
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Message */}
      {authError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{authError}</p>
        </div>
      )}

      {/* Username Field */}
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-indigo-200 mb-2">
          사용자명
        </label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400 transition-colors group-focus-within:text-indigo-300" />
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-indigo-300/50 focus:border-indigo-400/50 focus:bg-white/10 focus:shadow-lg focus:shadow-indigo-400/20 transition-all outline-none rounded-xl"
            placeholder="username"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Full Name Field */}
      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-sm font-medium text-indigo-200 mb-2">
          이름 (선택)
        </label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400 transition-colors group-focus-within:text-indigo-300" />
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-indigo-300/50 focus:border-indigo-400/50 focus:bg-white/10 focus:shadow-lg focus:shadow-indigo-400/20 transition-all outline-none rounded-xl"
            placeholder="홍길동"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-2">
          이메일
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400 transition-colors group-focus-within:text-indigo-300" />
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-indigo-300/50 focus:border-indigo-400/50 focus:bg-white/10 focus:shadow-lg focus:shadow-indigo-400/20 transition-all outline-none rounded-xl"
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-indigo-200 mb-2">
          비밀번호
        </label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400 transition-colors group-focus-within:text-indigo-300" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
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
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-indigo-200 mb-2">
          비밀번호 확인
        </label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400 transition-colors group-focus-within:text-indigo-300" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full pl-12 pr-12 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-indigo-300/50 focus:border-indigo-400/50 focus:bg-white/10 focus:shadow-lg focus:shadow-indigo-400/20 transition-all outline-none rounded-xl"
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
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
            계정 생성 중...
          </>
        ) : (
          <>
            계정 생성하기
            <ArrowRight className="h-5 w-5 inline-block ml-2" />
          </>
        )}
      </button>
    </form>
  );
}
