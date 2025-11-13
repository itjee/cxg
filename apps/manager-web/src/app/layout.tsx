import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { QueryProvider } from "@/lib/query-provider";
import { AuthProvider } from "@/features/auth";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";

// Import dev tools in development only
if (process.env.NODE_ENV === "development") {
  import("@/lib/dev-auth");
}

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "ConexGrow Manager - AI-Powered Business Support Platform",
  description: "ConexGrow by CXG - Manage tenants, infrastructure, and analytics for your business platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className="dark">
      <body className={`${GeistSans.variable} ${pretendard.variable}`}>
        <ThemeProvider defaultTheme="dark" >
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <Toaster />
        <Sonner position="top-right" richColors />
      </body>
    </html>
  );
}
