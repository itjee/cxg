"use client";

import Image from "next/image";
import { SigninForm } from "@/features/auth";
import { CheckCircle2, TrendingUp, Shield, Zap } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black relative overflow-hidden">
      {/* Global Animated Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-violet-600/5 rounded-full blur-3xl"></div>

      {/* Top Header - Fixed 60px */}
      <div
        className="fixed top-0 left-0 right-0 h-[60px] z-50 flex items-center animate-fade-in"
        style={{ paddingLeft: "60px" }}
      >
        <div className="flex items-center gap-3">
          <Image
            src="/logo/manager_logo.png"
            alt="CXG Logo"
            width={32}
            height={32}
            style={{ width: "32px", height: "32px", objectFit: "contain", opacity: 0.5 }}
            priority
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">ConexGrow</span>
            <span className="text-xs text-neutral-400">by CXG</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex pt-[60px] min-h-screen">
        {/* Left Side - Platform Features (50%) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div
            className="relative z-10 flex flex-col justify-between py-12 text-white w-full animate-slide-in-left"
            style={{ paddingLeft: "120px", paddingRight: "60px" }}
          >
            <div>
              {/* Main Headline */}
              <div className="space-y-6 mb-12">
                <h1 className="text-5xl font-bold leading-tight">
                  AI로 똑똑해지는
                  <br />
                  비즈니스 성장 플랫폼
                </h1>
                <p className="text-xl text-neutral-400 leading-relaxed">
                  중소기업을 위한 올인원 비즈니스 관리 솔루션으로
                  <br />
                  업무 효율을 극대화하세요
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="h-12 w-12 bg-violet-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-violet-600/30 transition-all border border-violet-600/30">
                  <TrendingUp className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    실시간 비즈니스 인사이트
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    AI 기반 데이터 분석으로 비즈니스 성장 기회를 놓치지 마세요
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="h-12 w-12 bg-violet-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-violet-600/30 transition-all border border-violet-600/30">
                  <Zap className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    스마트 워크플로우 자동화
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    반복 작업을 자동화하고 핵심 업무에 집중하세요
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="h-12 w-12 bg-violet-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-violet-600/30 transition-all border border-violet-600/30">
                  <Shield className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    엔터프라이즈급 보안
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    은행 수준의 보안으로 소중한 비즈니스 데이터를 보호합니다
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-neutral-500 border-t border-neutral-800 pt-6">
              <p>© 2025 CXG. All rights reserved.</p>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-violet-400" />
                <span>5,000+ 기업이 사용 중</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form Card (50%) */}
        <div
          className="flex-1 lg:w-1/2 flex items-start justify-start py-12 relative z-10 animate-slide-in-right"
          style={{ paddingLeft: "120px", paddingRight: "60px" }}
        >
          <div className="w-full" style={{ maxWidth: "462px" }}>
            {/* Login Card */}
            <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-8 transition-all duration-500 hover:shadow-3xl hover:shadow-violet-500/20 hover:border-white/20 hover:scale-[1.01]">
              {/* Mobile Logo */}
              <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
                <Image
                  src="/logo/manager_logo.png"
                  alt="CXG Logo"
                  width={32}
                  height={32}
                  style={{ width: "32px", height: "32px", objectFit: "contain", opacity: 0.5 }}
                  priority
                />
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">
                    ConexGrow
                  </span>
                  <span className="text-xs text-neutral-400">by CXG</span>
                </div>
              </div>

              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-br from-white via-neutral-100 to-neutral-200 bg-clip-text text-transparent mb-2">
                  환영합니다
                </h2>
                <p className="text-neutral-300">관리자 계정으로 로그인하세요</p>
              </div>

              {/* Login Form Component */}
              <SigninForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
