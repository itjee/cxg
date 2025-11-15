"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Zap, BarChart3, Users, CheckCircle2 } from "lucide-react";
import { SignupForm } from "@/features/auth";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/overview";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden flex pt-[60px]">
      {/* Left Side - Signup Form */}
      <div className="flex-1 lg:w-1/2 flex items-start justify-center py-12 relative z-10 animate-slide-in-left" style={{ paddingLeft: '60px', paddingRight: '60px' }}>
        <div className="w-full" style={{ maxWidth: '462px' }}>
          {/* Signup Card */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-8 transition-all duration-500 hover:shadow-3xl hover:shadow-indigo-500/20 hover:border-white/20 hover:scale-[1.01]">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
              <div className="flex items-center gap-2">
                <Image
                  src="/logos/logo_text_indigo.png"
                  alt="ConexGrow Logo"
                  width={44}
                  height={44}
                  style={{ objectFit: "contain" }}
                  priority
                />
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">ConexGrow</span>
                  <span className="text-xs text-indigo-300">비즈니스 성장 플랫폼</span>
                </div>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-br from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent mb-2">
                무료로 시작하기
              </h2>
              <p className="text-indigo-300">
                지금 바로 계정을 만들고 플랫폼을 경험하세요
              </p>
            </div>

            {/* Signup Form */}
            <SignupForm redirectTo={redirectTo} />

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-indigo-300">
                이미 계정이 있으신가요?{" "}
                <Link href="/signin" className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
                  로그인하기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between py-12 text-white w-full animate-slide-in-right" style={{ paddingLeft: '60px', paddingRight: '120px' }}>
          <div>
            <div className="space-y-6 mb-12">
              <h1 className="text-5xl font-bold leading-tight">
                비즈니스의<br />
                새로운 시작
              </h1>
              <p className="text-xl text-indigo-300 leading-relaxed">
                ConexGrow와 함께<br />
                스마트한 업무 관리를 시작하세요
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="h-12 w-12 bg-indigo-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/30 transition-all border border-indigo-600/30">
                <Zap className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">빠른 설정</h3>
                <p className="text-indigo-300 text-sm leading-relaxed">
                  5분 안에 계정 생성하고 바로 사용 시작
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="h-12 w-12 bg-indigo-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/30 transition-all border border-indigo-600/30">
                <BarChart3 className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">무료 체험</h3>
                <p className="text-indigo-300 text-sm leading-relaxed">
                  14일 무료 체험으로 모든 기능 이용 가능
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="h-12 w-12 bg-indigo-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/30 transition-all border border-indigo-600/30">
                <Users className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">팀 협업</h3>
                <p className="text-indigo-300 text-sm leading-relaxed">
                  팀원을 초대하고 함께 효율적으로 일하세요
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-indigo-400 border-t border-indigo-800 pt-6">
            <p>© 2025 ConexGrow. All rights reserved.</p>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />
              <span>신뢰할 수 있는 플랫폼</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
