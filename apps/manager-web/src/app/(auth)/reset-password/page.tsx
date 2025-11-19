"use client";

import { Suspense } from "react";
import Image from "next/image";
import { ResetPasswordForm } from "@/features/auth";

function ResetPasswordContent() {
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
            width={32}
            height={32}
            style={{ width: "32px", height: "32px", objectFit: "contain", opacity: 0.5 }}
            priority
          />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">ConexGrow</span>
            <span className="text-sm text-neutral-400">by CXG</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <ResetPasswordForm />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
