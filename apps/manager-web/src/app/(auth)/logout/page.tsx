"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, CheckCircle2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();
  const { logout, clearAuth } = useAuthStore();
  const [status, setStatus] = useState<"logging_out" | "success">("logging_out");

  useEffect(() => {
    const performLogout = async () => {
      try {
        // 서버에 로그아웃 요청
        await logout();
        setStatus("success");

        // 1초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          router.push("/signin");
        }, 1000);
      } catch (error) {
        console.error("Logout error:", error);
        // 에러가 발생해도 로컬 상태는 초기화하고 리다이렉트
        clearAuth();
        setTimeout(() => {
          router.push("/signin");
        }, 1000);
      }
    };

    performLogout();
  }, [router, logout, clearAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black flex items-center justify-center p-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <Card className="w-full max-w-md bg-neutral-900/60 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/50 relative z-10 animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${
              status === "success" 
                ? "bg-green-500/20 border-2 border-green-500/50" 
                : "bg-violet-600/20 border-2 border-violet-600/50"
            }`}>
              {status === "success" ? (
                <CheckCircle2 className="h-8 w-8 text-green-500 animate-scale-in" />
              ) : (
                <LogOut className="h-8 w-8 text-violet-400 animate-pulse" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl text-white">
            {status === "success" ? "로그아웃 완료" : "로그아웃 중..."}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-neutral-400">
            {status === "success" 
              ? "안전하게 로그아웃되었습니다. 로그인 페이지로 이동합니다." 
              : "안전하게 로그아웃하고 있습니다."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
