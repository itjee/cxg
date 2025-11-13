"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 인증 페이지에서는 항상 다크테마 강제
    const html = document.documentElement;
    html.classList.remove("light");
    html.classList.add("dark");

    // 컴포넌트 언마운트 시 테마 복원
    return () => {
      html.classList.remove("dark");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Global Animated Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-indigo-500/5 rounded-full blur-3xl"></div>

      {/* Top Header - Fixed 60px */}
      <div className="fixed top-0 left-0 right-0 h-[60px] z-50 flex items-center animate-fade-in" style={{ paddingLeft: '60px' }}>
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="/logos/logo_text_indigo.png"
            alt="ConexGrow Logo"
            width={44}
            height={44}
            style={{ height: "auto" }}
            className="object-contain"
            quality={100}
            priority
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white">ConexGrow</span>
            <span className="text-xs text-indigo-300">비즈니스 성장 플랫폼</span>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
