import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const features = [
  {
    category: "영업 관리 (SRM)",
    icon: "📊",
    items: [
      "AI 기반 영업 기회 분석",
      "견적 및 계약 관리",
      "영업 파이프라인 시각화",
      "실시간 영업 대시보드",
    ],
  },
  {
    category: "고객 관리 (CSM)",
    icon: "👥",
    items: [
      "통합 고객 정보 관리",
      "고객 상호작용 이력 추적",
      "AI 기반 고객 세분화",
      "고객 만족도 분석",
    ],
  },
  {
    category: "구매 관리 (PSM)",
    icon: "🛒",
    items: [
      "구매 요청 및 승인 워크플로우",
      "공급업체 관리",
      "발주 및 입고 관리",
      "구매 비용 분석",
    ],
  },
  {
    category: "재고 관리 (IVM)",
    icon: "📦",
    items: [
      "실시간 재고 현황 파악",
      "자동 발주점 알림",
      "입출고 이력 관리",
      "재고 회전율 분석",
    ],
  },
  {
    category: "재무 관리 (FIM)",
    icon: "💰",
    items: [
      "통합 회계 처리",
      "매출/매입 관리",
      "자금 흐름 분석",
      "재무제표 자동 생성",
    ],
  },
  {
    category: "워크플로우 (LWM)",
    icon: "⚡",
    items: [
      "비즈니스 프로세스 자동화",
      "승인 워크플로우 엔진",
      "업무 진행 상황 추적",
      "프로세스 최적화 제안",
    ],
  },
  {
    category: "자산 관리 (ASM)",
    icon: "🏢",
    items: [
      "자산 등록 및 이력 관리",
      "감가상각 자동 계산",
      "자산 유지보수 일정 관리",
      "자산 활용도 분석",
    ],
  },
  {
    category: "비즈니스 인텔리전스 (BIM)",
    icon: "📈",
    items: [
      "실시간 비즈니스 대시보드",
      "AI 기반 인사이트 제공",
      "맞춤형 리포트 생성",
      "예측 분석 및 시뮬레이션",
    ],
  },
  {
    category: "커뮤니케이션 (COM)",
    icon: "💬",
    items: [
      "팀 협업 메신저",
      "파일 공유 및 버전 관리",
      "화상 회의 통합",
      "알림 및 공지사항",
    ],
  },
];

const highlights = [
  {
    title: "AI 기반 자동화",
    description: "반복적인 업무를 AI가 자동으로 처리하여 생산성을 극대화합니다.",
    icon: "🤖",
  },
  {
    title: "통합 플랫폼",
    description: "모든 업무 시스템이 하나의 플랫폼에서 원활하게 연동됩니다.",
    icon: "🔗",
  },
  {
    title: "실시간 분석",
    description: "비즈니스 데이터를 실시간으로 분석하여 빠른 의사결정을 지원합니다.",
    icon: "⚡",
  },
  {
    title: "확장 가능",
    description: "비즈니스 성장에 따라 필요한 기능을 유연하게 추가할 수 있습니다.",
    icon: "📈",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              비즈니스 성장을 위한
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                올인원 솔루션
              </span>
            </h1>
            <p className="mb-8 text-lg text-slate-600 sm:text-xl">
              ConexGrow는 중소기업이 필요로 하는 모든 업무 시스템을
              <br />
              하나의 플랫폼에서 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="border-y border-slate-200 bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((highlight) => (
              <div key={highlight.title} className="text-center">
                <div className="mb-4 text-5xl">{highlight.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {highlight.title}
                </h3>
                <p className="text-sm text-slate-600">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              통합 업무 관리 시스템
            </h2>
            <p className="text-lg text-slate-600">
              9개 핵심 모듈로 비즈니스 전체를 관리하세요
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.category}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {feature.category}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {feature.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
              지금 바로 시작하세요
            </h2>
            <p className="mb-8 text-lg text-indigo-100">
              14일 무료 체험으로 ConexGrow의 모든 기능을 경험해보세요.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                무료로 시작하기
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-indigo-600"
              >
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
