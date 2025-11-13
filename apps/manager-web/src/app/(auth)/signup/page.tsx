"use client";

import Image from "next/image";
import { SignupForm } from "@/features/auth";
import {
  BarChart3,
  Users,
  Workflow,
  Star,
  User,
} from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black relative overflow-hidden">
      {/* Global Animated Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-violet-600/5 rounded-full blur-3xl"></div>

      {/* Top Header - Fixed 60px */}
      <div className="fixed top-0 left-0 right-0 h-[60px] z-50 flex items-center animate-fade-in" style={{ paddingLeft: '60px' }}>
        <div className="flex items-center gap-3">
          <Image
            src="/logo/manager_logo.png"
            alt="CXG Logo"
            width={0}
            height={32}
            className="object-contain w-auto h-8"
            style={{ opacity: 0.5 }}
            quality={100}
            priority
            unoptimized
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">ConexGrow</span>
            <span className="text-xs text-neutral-400">by CXG</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex pt-[60px] min-h-screen">
        {/* Left Side - Signup Form Card (50%) */}
        <div className="flex-1 lg:w-1/2 flex items-start justify-center py-12 relative z-10 animate-slide-in-left" style={{ paddingLeft: '60px', paddingRight: '60px' }}>
          <div className="w-full" style={{ maxWidth: '462px' }}>
          {/* Signup Card */}
          <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-8 transition-all duration-500 hover:shadow-3xl hover:shadow-violet-500/20 hover:border-white/20 hover:scale-[1.01]">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <Image
              src="/logo/manager_logo.png"
              alt="CXG Logo"
              width={0}
              height={32}
              className="object-contain w-auto h-8"
              style={{ opacity: 0.5 }}
              quality={100}
              priority
              unoptimized
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">ConexGrow</span>
              <span className="text-xs text-neutral-400">by CXG</span>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-br from-white via-neutral-100 to-neutral-200 bg-clip-text text-transparent mb-2">
              관리자 계정 신청
            </h2>
            <p className="text-neutral-300">
              운영자 시스템 관리자 계정을 신청하세요
            </p>
          </div>

          {/* Signup Form Component */}
          <SignupForm />
          </div>
          </div>
        </div>

        {/* Right Side - Platform Benefits (50%) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="relative z-10 flex flex-col justify-between py-12 text-white w-full animate-slide-in-right" style={{ paddingLeft: '120px', paddingRight: '60px' }}>
          <div>

            {/* Main Headline */}
            <div className="space-y-6 mb-12">
              <h1 className="text-5xl font-bold leading-tight">
                지금 시작하세요<br />
                비즈니스 혁신의 순간
              </h1>
              <p className="text-xl text-neutral-400 leading-relaxed">
                5,000개 이상의 기업이 ConexGrow와 함께<br />
                성공적인 디지털 전환을 이뤄냈습니다
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="h-12 w-12 bg-violet-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-violet-600/30 transition-all border border-violet-600/30">
                <BarChart3 className="h-6 w-6 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">무료로 시작, 자유롭게 확장</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  기본 기능은 무료로 제공되며, 필요에 따라 언제든 업그레이드 가능합니다
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="h-12 w-12 bg-violet-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-violet-600/30 transition-all border border-violet-600/30">
                <Users className="h-6 w-6 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">팀과 함께 협업</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  팀원 초대부터 권한 관리까지, 협업에 필요한 모든 기능을 제공합니다
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="h-12 w-12 bg-violet-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-violet-600/30 transition-all border border-violet-600/30">
                <Workflow className="h-6 w-6 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">5분 만에 시작</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  복잡한 설정 없이 바로 시작하세요. 직관적인 인터페이스로 쉽게 사용할 수 있습니다
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm border-t border-neutral-800 pt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-violet-600/20 border-2 border-violet-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-violet-400" />
                  </div>
                ))}
              </div>
              <p className="text-neutral-400">
                <span className="font-semibold text-white">5,000+</span> 기업이 이미 사용 중
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-violet-400 text-violet-400" />
                ))}
              </div>
              <p className="text-sm text-neutral-400">
                <span className="font-semibold text-white">4.9/5</span> 평균 만족도
              </p>
            </div>

            <p className="text-sm text-neutral-500">© 2025 CXG. All rights reserved.</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
