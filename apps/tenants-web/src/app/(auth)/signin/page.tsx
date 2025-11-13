"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  TrendingUp,
  Zap,
  Shield,
  CheckCircle2,
  Mail,
  Lock,
} from "lucide-react";
import { SigninForm } from "@/features/auth";
import { useAuth } from "@/features/auth";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const { demoLogin } = useAuth();
  const redirectTo = searchParams.get("from") || "/overview";

  const handleDemoLogin = async () => {
    await demoLogin(redirectTo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden flex pt-[60px]">
      {/* Left Side - Platform Features */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="relative z-10 flex flex-col justify-between py-12 text-white w-full animate-slide-in-left"
          style={{ paddingLeft: "120px", paddingRight: "60px" }}
        >
          <div>
            {/* Main Headline */}
            <div className="space-y-6 mb-12">
              <h1 className="text-5xl font-bold leading-tight">
                스마트한
                <br />
                비즈니스 성장 플랫폼
              </h1>
              <p className="text-xl text-indigo-300 leading-relaxed">
                중소기업의 성장을 돕는
                <br />
                통합 관리 솔루션
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="h-12 w-12 bg-indigo-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/30 transition-all border border-indigo-600/30">
                <TrendingUp className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  실시간 데이터 분석
                </h3>
                <p className="text-indigo-300 text-sm leading-relaxed">
                  주요 지표를 한 눈에 파악하고 빠른 의사결정을 하세요
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="h-12 w-12 bg-indigo-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/30 transition-all border border-indigo-600/30">
                <Zap className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  효율적인 업무 관리
                </h3>
                <p className="text-indigo-300 text-sm leading-relaxed">
                  반복 업무를 자동화하고 핵심 업무에 집중하세요
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="h-12 w-12 bg-indigo-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/30 transition-all border border-indigo-600/30">
                <Shield className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  안전한 데이터 관리
                </h3>
                <p className="text-indigo-300 text-sm leading-relaxed">
                  엔터프라이즈급 보안으로 중요한 정보를 보호합니다
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-indigo-400 border-t border-indigo-800 pt-6">
            <p>© 2025 ConexGrow. All rights reserved.</p>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />
              <span>5,000+ 기업이 신뢰 중</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div
        className="flex-1 lg:w-1/2 flex items-start justify-start py-12 relative z-10 animate-slide-in-right"
        style={{ paddingLeft: "120px", paddingRight: "60px" }}
      >
        <div className="w-full" style={{ maxWidth: "462px" }}>
          {/* Login Card */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-8 transition-all duration-500 hover:shadow-3xl hover:shadow-indigo-500/20 hover:border-white/20 hover:scale-[1.01]">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
              <div className="flex items-center gap-2">
                <Image
                  src="/logos/logo_text_indigo.png"
                  alt="ConexGrow Logo"
                  width={88}
                  height={44}
                  className="object-contain"
                  quality={100}
                  priority
                />
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">
                    ConexGrow
                  </span>
                  <span className="text-xs text-indigo-300">
                    비즈니스 성장 플랫폼
                  </span>
                </div>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-br from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent mb-2">
                로그인
              </h2>
              <p className="text-indigo-300">계속해서 플랫폼을 이용하세요</p>
            </div>

            {/* Sign In Form */}
            <SigninForm redirectTo={redirectTo} onDemoLogin={handleDemoLogin} />

            {/* Sign Up Link 
            <div className="mt-6 text-center">
              <p className="text-sm text-indigo-300">
                아직 계정이 없으신가요?{" "}
                <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
                  무료로 시작하기
                </Link>
              </p>
            </div>
            */}

            {/* Demo Info */}
            <div className="mt-6 p-5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-indigo-200 font-semibold uppercase tracking-wide">
                  데모 계정 정보
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="font-medium text-indigo-200">이메일:</span>
                  <span className="text-indigo-300">demo@cxg.co.kr</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="font-medium text-indigo-200">비밀번호:</span>
                  <span className="text-indigo-300">demo1234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
