/**
 * 비밀번호 찾기 폼 컴포넌트
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useResetPassword } from "../hooks/use-reset-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

interface ForgotPasswordFormProps {
  onSuccess?: (email: string, resetToken?: string) => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const { forgotPassword, isLoading, error } = useResetPassword();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    const result = await forgotPassword(email);

    if (result.success) {
      setSuccess(true);
      // 개발 환경에서만 토큰 표시
      if (result.data?.reset_token) {
        setResetToken(result.data.reset_token);
      }
      if (onSuccess) {
        onSuccess(email, result.data?.reset_token);
      }
    }
  };

  if (success) {
    return (
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 bg-green-600/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          이메일을 확인해주세요
        </h2>

        <p className="text-neutral-300 mb-6">
          <span className="font-semibold text-white">{email}</span>로<br />
          비밀번호 재설정 링크를 발송했습니다.
        </p>

        {resetToken && (
          <div className="mb-6 p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
            <p className="text-xs text-violet-400 mb-2 font-semibold">🔧 개발 환경 - 재설정 토큰</p>
            <div className="bg-black/30 p-3 rounded-lg mb-3">
              <p className="text-xs text-white font-mono break-all select-all">{resetToken}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/reset-password?token=${resetToken}`}
                className="flex-1 text-center px-4 py-2 text-sm text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors font-medium"
              >
                바로 재설정하기 →
              </Link>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(resetToken);
                  alert("토큰이 복사되었습니다!");
                }}
                className="px-4 py-2 text-sm text-violet-400 hover:text-violet-300 border border-violet-500/30 hover:border-violet-500/50 rounded-lg transition-colors"
              >
                복사
              </button>
            </div>
          </div>
        )}

        <p className="text-sm text-neutral-400 mb-8">
          이메일이 도착하지 않았나요?<br />
          스팸 메일함을 확인해주세요.
        </p>

        <div className="space-y-3">
          <Link href="/signin">
            <Button className="w-full h-12 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-xl font-semibold">
              로그인으로 돌아가기
            </Button>
          </Link>

          <button
            onClick={() => setSuccess(false)}
            className="w-full text-sm text-neutral-400 hover:text-white transition-colors"
          >
            다른 이메일로 재시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
      {/* Back Button */}
      <Link
        href="/signin"
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        로그인으로 돌아가기
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-br from-white via-neutral-100 to-neutral-200 bg-clip-text text-transparent mb-2">
          비밀번호 찾기
        </h2>
        <p className="text-neutral-300">
          가입하신 이메일 주소를 입력해주세요
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200/80 shadow-sm">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-neutral-200 font-medium text-sm">
            이메일
          </Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-violet-400" />
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              className="pl-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-neutral-600 focus:border-violet-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-violet-500/20 rounded-xl transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Info Notice */}
        <div className="flex items-start gap-3 p-4 bg-violet-500/10 backdrop-blur-sm rounded-xl border border-violet-500/20 shadow-sm">
          <AlertCircle className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-neutral-300 leading-relaxed">
            입력하신 이메일로 비밀번호 재설정 링크를 발송합니다.<br />
            링크는 1시간 동안 유효합니다.
          </p>
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
              발송 중...
            </>
          ) : (
            "재설정 링크 발송"
          )}
        </Button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-neutral-400 text-sm">
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="text-violet-400 hover:text-violet-300 transition-colors font-semibold"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
