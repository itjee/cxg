import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "pretendard/dist/web/variable/pretendardvariable.css";
import "./globals.css";
import { ThemeProvider, QueryClientProviderWrapper, AuthProvider } from "@/components/providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ConexGrow - AI 기반 중소기업 업무 통합 플랫폼 by CXG",
  description: "50인 이하 중소기업을 위한 통합 업무 솔루션. ERP, CRM, SCM, WMS를 하나로 통합하여 업무 효율을 극대화하세요.",
  keywords: ["ERP", "CRM", "SCM", "WMS", "중소기업", "업무관리", "통합솔루션", "AI", "ConexGrow", "CXG"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('conexgrow-theme') || 'dark';
                const root = document.documentElement;
                
                root.classList.remove('light', 'dark');
                
                if (theme === 'system') {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  root.classList.add(systemTheme);
                } else {
                  root.classList.add(theme);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`} style={{ fontFamily: "'Pretendard Variable', var(--font-geist-sans), sans-serif" }}>
        <QueryClientProviderWrapper>
          <AuthProvider>
            <ThemeProvider defaultTheme="dark" storageKey="conexgrow-theme">
              {children}
              <Toaster position="bottom-center" richColors />
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
