import Link from "next/link";
import Image from "next/image";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logos/logo_text_black.png"
                alt="Tenants Logo"
                height={32}
                width={64}
                className="h-8 w-auto"
                priority
              />
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ConexGrow
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                기능
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                가격
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                문의
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/signin"
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 font-semibold shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 hover:scale-105"
                >
                  무료 시작
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
