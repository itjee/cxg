/**
 * Next.js Middleware for authentication
 * 보호된 라우트에 대한 인증 체크
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 인증이 필요한 경로 (보호된 라우트)
const protectedRoutes = [
  "/core",
  "/settings",
  "/profile",
  "/tnnt",
  "/idam",
  "/audt",
  "/auto",
  "/bill",
  "/bkup",
  "/cnfg",
  "/ifra",
  "/intg",
  "/mntr",
  "/noti",
  "/stat",
  "/supt",
  "/analytics",
];

// 인증이 필요 없는 경로 (공개 라우트)
const publicRoutes = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // favicon 요청 처리
  if (pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // 보호된 라우트인지 확인
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // 인증 토큰 확인 (쿠키에서)
  const accessToken = request.cookies.get("access_token")?.value;

  // 보호된 라우트에 접근하려는데 토큰이 없으면 로그인 페이지로 리다이렉트
  if (isProtectedRoute && !accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // 이미 로그인한 사용자가 인증 페이지에 접근하면 대시보드로 리다이렉트
  if (isPublicRoute && accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/core/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|logos|logo|icons|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif).*)",
  ],
};
