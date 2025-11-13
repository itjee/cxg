import Link from "next/link";
import { 
  ArrowRight, 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Workflow,
  Zap,
  Shield,
  Globe,
  Brain,
  CheckCircle2,
  Sparkles,
  Play
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-70"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 py-24 sm:py-32 lg:py-40">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 backdrop-blur-sm border border-indigo-200/50 rounded-full text-sm font-medium text-indigo-700 hover:scale-105 transition-transform">
              <Sparkles className="h-4 w-4" />
              AI 기반 중소기업 업무 통합 플랫폼
            </div>
            
            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold" style={{ fontWeight: 950 }}>
                Connect. Experience. Grow.
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-6 leading-relaxed max-w-3xl mx-auto font-light">
              비즈니스를 <span className="font-semibold text-indigo-600">연결</span>하고, 
              최고의 경험을 <span className="font-semibold text-purple-600">제공</span>하며,
              함께 <span className="font-semibold text-pink-600">성장</span>합니다
            </p>
            <p className="text-lg sm:text-xl text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto">
              ConexGrow는 중소기업의 스마트한 성장 파트너입니다.
              <br className="hidden sm:block" />
              AI 기반 통합 플랫폼으로 업무 효율을 극대화하고 성장을 가속화하세요.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center flex-col sm:flex-row mb-16">
              <Link 
                href="/signup"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 font-semibold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105"
              >
                무료로 시작하기
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#demo"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 rounded-xl hover:bg-white hover:border-gray-300 transition-all duration-300 font-semibold text-lg shadow-md hover:shadow-lg"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                데모 보기
              </Link>
            </div>
            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
                </div>
                <span className="font-medium">1,234+ 기업이 사용 중</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <span className="ml-2 font-medium">4.9/5.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              핵심 기능
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
              하나의 플랫폼, <span className="text-indigo-600">무한한 가능성</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              업무의 모든 영역을 통합하여 효율적으로 관리하세요
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-2xl bg-white border border-gray-100 hover:border-transparent hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg shadow-indigo-500/30">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CXG Philosophy Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bS0yIDB2Mmgydi0yaC0yem0tMiAwdjJoMnYtMmgtMnptLTIgMHYyaDJ2LTJoLTJ6bS0yIDB2Mmgydi0yaC0yem0tMiAwdjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6" style={{ fontWeight: 950 }}>
              Connect. Experience. Grow.
            </h2>
            <p className="text-xl text-indigo-50 max-w-3xl mx-auto leading-relaxed">
              CXG의 철학이 담긴 ConexGrow, 비즈니스 성장의 새로운 패러다임
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-400/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-6xl font-extrabold text-white mb-4 group-hover:scale-110 transition-transform">
                  C
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Connect</h3>
                <h4 className="text-xl font-semibold text-indigo-100 mb-4">연결</h4>
                <p className="text-indigo-50 leading-relaxed">
                  고객, 파트너, 시스템을 하나로 연결하여 원활한 협업 환경을 구축합니다.
                  분산된 데이터와 프로세스를 통합하여 비즈니스의 모든 요소가 유기적으로 소통합니다.
                </p>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-400/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-6xl font-extrabold text-white mb-4 group-hover:scale-110 transition-transform">
                  X
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">eXperience</h3>
                <h4 className="text-xl font-semibold text-purple-100 mb-4">경험</h4>
                <p className="text-indigo-50 leading-relaxed">
                  직관적이고 세련된 인터페이스로 최상의 사용자 경험을 제공합니다.
                  AI가 업무 패턴을 학습하여 개인화된 인사이트와 자동화로 업무를 더욱 효율적으로 만듭니다.
                </p>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-400/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-6xl font-extrabold text-white mb-4 group-hover:scale-110 transition-transform">
                  G
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Grow</h3>
                <h4 className="text-xl font-semibold text-pink-100 mb-4">성장</h4>
                <p className="text-indigo-50 leading-relaxed">
                  데이터 기반 의사결정과 자동화로 비즈니스 성장을 가속화합니다.
                  확장 가능한 플랫폼으로 기업의 성장 단계에 맞춰 유연하게 진화합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-white/20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl sm:text-6xl font-extrabold text-white mb-3 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-lg text-indigo-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="relative py-24 sm:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              핵심 가치
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
              중소기업의 <span className="text-indigo-600">스마트한 성장 파트너</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              비즈니스를 연결하고, 성장을 가속화합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Overview */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-400/5 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
              올인원 솔루션
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
              통합 <span className="text-indigo-600">관리 모듈</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              모든 업무 프로세스를 하나의 플랫폼에서
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <div 
                key={index}
                className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {module.description}
                  </p>
                  <ul className="space-y-2">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-500 flex items-center group/item">
                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mr-2 group-hover/item:scale-150 transition-transform" />
                        <span className="group-hover/item:text-gray-700 transition-colors">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white mb-8">
              <Sparkles className="h-4 w-4" />
              14일 무료 체험
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl sm:text-2xl text-indigo-100 mb-12 font-light max-w-2xl mx-auto">
              ConexGrow의 강력한 기능을 직접 경험해보세요
              <br className="hidden sm:block" />
              신용카드 등록 없이 무료로 시작할 수 있습니다
            </p>
            
            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center px-10 py-5 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                무료 체험 시작
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center px-10 py-5 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all duration-300 font-bold text-lg"
              >
                영업팀 문의
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex items-center justify-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>보안 인증</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-white/30"></div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>신용카드 불필요</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-white/30"></div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span>즉시 사용 가능</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-white font-bold text-2xl mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                ConexGrow
              </h3>
              <p className="text-sm leading-relaxed mb-2">
                비즈니스를 연결하고, 성장을 가속화하는
                <br />중소기업의 스마트한 성장 파트너
              </p>
              <p className="text-xs text-gray-500 mb-4">
                by <span className="font-semibold">CXG</span> (Connect · eXperience · Grow)
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-indigo-400 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">제품</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">기능 소개</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">가격 안내</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">고객 사례</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">데모 요청</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">지원</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">도움말 센터</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API 문서</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">커뮤니티</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">시스템 상태</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">회사</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">회사 소개</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">채용</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">문의하기</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">파트너</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p>&copy; 2025 ConexGrow by CXG. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="#" className="hover:text-white transition-colors">개인정보처리방침</Link>
                <Link href="#" className="hover:text-white transition-colors">이용약관</Link>
                <Link href="#" className="hover:text-white transition-colors">쿠키 정책</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Users,
    title: "고객관리 (CRM)",
    description: "고객 정보, 영업 기회, 활동 이력을 한 곳에서 통합 관리하여 고객 만족도를 높이세요."
  },
  {
    icon: BarChart3,
    title: "재무관리 (FIM)",
    description: "실시간 재무 현황 파악, 예산 관리, 청구서 발행까지 재무 업무를 자동화하세요."
  },
  {
    icon: Package,
    title: "재고관리 (IVM)",
    description: "재고 수준 추적, 창고 관리, 재고 이동 기록으로 효율적인 재고 운영이 가능합니다."
  },
  {
    icon: ShoppingCart,
    title: "구매관리 (PSM)",
    description: "발주부터 입고까지 구매 프로세스를 체계적으로 관리하고 공급업체와 협업하세요."
  },
  {
    icon: TrendingUp,
    title: "판매관리 (SRM)",
    description: "주문, 견적, 판매 활동을 통합 관리하여 매출 증대 기회를 놓치지 마세요."
  },
  {
    icon: Workflow,
    title: "워크플로우 (LWM)",
    description: "승인 프로세스와 업무 흐름을 자동화하여 업무 효율을 극대화하세요."
  },
  {
    icon: Brain,
    title: "AI 지원",
    description: "인공지능이 데이터를 분석하고 인사이트를 제공하여 더 나은 의사결정을 돕습니다."
  },
  {
    icon: Shield,
    title: "보안 & 컴플라이언스",
    description: "엔터프라이즈급 보안과 감사 로그로 데이터를 안전하게 보호합니다."
  },
  {
    icon: Globe,
    title: "멀티 테넌트",
    description: "여러 조직을 독립적으로 관리하면서도 통합된 플랫폼의 이점을 누리세요."
  },
  {
    icon: Zap,
    title: "실시간 동기화",
    description: "모든 모듈의 데이터가 실시간으로 동기화되어 항상 최신 정보를 제공합니다."
  }
];

const stats = [
  { value: "50+", label: "중소기업 고객사" },
  { value: "99.9%", label: "서비스 가동률" },
  { value: "40%", label: "업무 효율 향상" },
  { value: "24/7", label: "고객 지원" }
];

const benefits = [
  {
    title: "통합 플랫폼의 편리함",
    description: "여러 시스템을 오가며 작업할 필요 없이 하나의 플랫폼에서 모든 업무를 처리할 수 있습니다."
  },
  {
    title: "비용 절감",
    description: "별도의 시스템 구매 및 유지보수 비용 없이 합리적인 월 구독료로 모든 기능을 이용하세요."
  },
  {
    title: "빠른 도입",
    description: "복잡한 설치 과정 없이 클라우드 기반으로 즉시 사용을 시작할 수 있습니다."
  },
  {
    title: "쉬운 사용",
    description: "직관적인 인터페이스로 별도의 교육 없이도 바로 사용할 수 있습니다."
  },
  {
    title: "확장 가능",
    description: "비즈니스 성장에 따라 필요한 기능을 유연하게 추가할 수 있습니다."
  },
  {
    title: "데이터 기반 의사결정",
    description: "실시간 대시보드와 리포트로 데이터에 기반한 전략적 의사결정이 가능합니다."
  }
];

const modules = [
  {
    icon: Users,
    title: "CRM",
    description: "고객 관계 관리",
    features: ["고객 정보", "영업 기회", "활동 추적", "고객 분석"]
  },
  {
    icon: BarChart3,
    title: "재무관리",
    description: "Finance & Accounting",
    features: ["계정 관리", "예산 편성", "청구서 발행", "재무 보고서"]
  },
  {
    icon: Package,
    title: "재고관리",
    description: "Inventory Management",
    features: ["재고 추적", "창고 관리", "재고 이동", "재고 조정"]
  },
  {
    icon: ShoppingCart,
    title: "구매관리",
    description: "Procurement",
    features: ["구매 발주", "공급업체", "입고 처리", "구매 요청"]
  },
  {
    icon: TrendingUp,
    title: "판매관리",
    description: "Sales Management",
    features: ["판매 주문", "견적 관리", "판매 분석", "고객 관리"]
  },
  {
    icon: Workflow,
    title: "워크플로우",
    description: "Workflow Automation",
    features: ["승인 프로세스", "작업 자동화", "알림", "단계 관리"]
  },
  {
    icon: Brain,
    title: "BI & Analytics",
    description: "비즈니스 인텔리전스",
    features: ["대시보드", "리포트", "데이터 분석", "AI 인사이트"]
  },
  {
    icon: Globe,
    title: "통합관리",
    description: "System Integration",
    features: ["API 연동", "데이터 동기화", "외부 시스템", "웹훅"]
  }
];
