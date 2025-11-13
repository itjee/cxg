"use client";

import Image from "next/image";
import { ForgotPasswordForm } from "@/features/auth";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black relative overflow-hidden flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] z-50 flex items-center animate-fade-in" style={{ paddingLeft: '60px' }}>
        <div className="flex items-center gap-3">
          <Image
            src="/logo/manager_logo.png"
            alt="CXG Logo"
            width={0}
            height={44}
            className="object-contain w-auto h-11"
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

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
