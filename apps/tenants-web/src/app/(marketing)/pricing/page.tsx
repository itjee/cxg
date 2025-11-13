import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "성장하는 스타트업을 위한",
    price: "99,000",
    period: "월",
    features: [
      { name: "사용자 최대 10명", included: true },
      { name: "기본 모듈 5개", included: true },
      { name: "5GB 스토리지", included: true },
      { name: "이메일 지원", included: true },
      { name: "기본 리포트", included: true },
      { name: "모바일 앱", included: true },
      { name: "AI 자동화 (제한)", included: true },
      { name: "고급 분석", included: false },
      { name: "전화 지원", included: false },
      { name: "전담 매니저", included: false },
    ],
    cta: "무료 체험 시작",
    highlighted: false,
  },
  {
    name: "Professional",
    description: "성장하는 중소기업을 위한",
    price: "249,000",
    period: "월",
    features: [
      { name: "사용자 최대 30명", included: true },
      { name: "전체 모듈 9개", included: true },
      { name: "50GB 스토리지", included: true },
      { name: "우선 지원 (이메일/채팅)", included: true },
      { name: "고급 리포트 및 분석", included: true },
      { name: "모바일 앱", included: true },
      { name: "AI 자동화 (무제한)", included: true },
      { name: "고급 분석", included: true },
      { name: "전화 지원", included: true },
      { name: "전담 매니저", included: false },
    ],
    cta: "무료 체험 시작",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "대규모 조직을 위한",
    price: "협의",
    period: "",
    features: [
      { name: "사용자 무제한", included: true },
      { name: "전체 모듈 + 맞춤 개발", included: true },
      { name: "무제한 스토리지", included: true },
      { name: "24/7 전담 지원", included: true },
      { name: "맞춤형 리포트", included: true },
      { name: "모바일 앱 (화이트라벨)", included: true },
      { name: "AI 자동화 (맞춤형)", included: true },
      { name: "고급 분석 + 예측 모델", included: true },
      { name: "전화 지원 (24/7)", included: true },
      { name: "전담 매니저", included: true },
    ],
    cta: "영업팀 문의",
    highlighted: false,
  },
];

const addons = [
  {
    name: "추가 사용자",
    price: "10,000원/월",
    description: "사용자 1명당",
  },
  {
    name: "추가 스토리지",
    price: "5,000원/월",
    description: "10GB당",
  },
  {
    name: "고급 AI 분석",
    price: "50,000원/월",
    description: "예측 분석 및 인사이트",
  },
  {
    name: "커스텀 개발",
    price: "별도 협의",
    description: "맞춤형 기능 개발",
  },
];

const faqs = [
  {
    question: "무료 체험 기간은 얼마나 되나요?",
    answer:
      "14일 동안 모든 기능을 무료로 사용하실 수 있습니다. 신용카드 등록 없이 바로 시작 가능합니다.",
  },
  {
    question: "언제든지 플랜을 변경할 수 있나요?",
    answer:
      "네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 변경 사항은 다음 결제 주기부터 적용됩니다.",
  },
  {
    question: "결제 방법은 무엇이 있나요?",
    answer: "신용카드, 계좌이체, 무통장입금을 지원합니다. 연간 결제 시 20% 할인 혜택이 제공됩니다.",
  },
  {
    question: "데이터 보안은 어떻게 관리되나요?",
    answer:
      "AWS 기반 인프라에서 데이터를 암호화하여 저장하며, ISO 27001 인증을 획득했습니다. 정기적인 백업과 보안 감사를 실시합니다.",
  },
  {
    question: "계약 기간이 있나요?",
    answer:
      "최소 계약 기간은 없습니다. 월 단위로 사용하실 수 있으며, 언제든지 해지 가능합니다. 연간 계약 시 추가 할인 혜택이 있습니다.",
  },
  {
    question: "기술 지원은 어떻게 받을 수 있나요?",
    answer:
      "플랜에 따라 이메일, 채팅, 전화 지원을 제공합니다. Enterprise 플랜은 24/7 전담 지원팀이 배정됩니다.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              간단하고 투명한
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                가격 정책
              </span>
            </h1>
            <p className="mb-8 text-lg text-slate-600 sm:text-xl">
              비즈니스 규모에 맞는 플랜을 선택하세요.
              <br />
              언제든지 변경 가능합니다.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <Check className="h-5 w-5 text-green-600" />
              <span>14일 무료 체험</span>
              <span className="mx-2">•</span>
              <Check className="h-5 w-5 text-green-600" />
              <span>신용카드 등록 불필요</span>
              <span className="mx-2">•</span>
              <Check className="h-5 w-5 text-green-600" />
              <span>언제든지 해지 가능</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border ${
                  plan.highlighted
                    ? "border-indigo-600 shadow-xl ring-2 ring-indigo-600"
                    : "border-slate-200 shadow-sm"
                } bg-white p-8`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                    <span className="rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                      인기
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="mb-2 text-2xl font-bold text-slate-900">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-600">{plan.description}</p>
                </div>

                <div className="mb-8">
                  {plan.price === "협의" ? (
                    <div className="text-4xl font-bold text-slate-900">
                      맞춤 견적
                    </div>
                  ) : (
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-slate-900">
                        {plan.price}
                      </span>
                      <span className="ml-2 text-slate-600">원/{plan.period}</span>
                    </div>
                  )}
                </div>

                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      ) : (
                        <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-300" />
                      )}
                      <span
                        className={
                          feature.included ? "text-slate-700" : "text-slate-400"
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === "Enterprise" ? "/contact" : "/signup"}
                  className={`block w-full rounded-full px-6 py-3 text-center font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "border-2 border-slate-200 text-slate-900 hover:border-indigo-600 hover:text-indigo-600"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="border-y border-slate-200 bg-slate-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">추가 옵션</h2>
            <p className="text-lg text-slate-600">
              필요에 따라 추가 기능을 선택하세요
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {addons.map((addon) => (
              <div
                key={addon.name}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {addon.name}
                </h3>
                <p className="mb-4 text-sm text-slate-600">{addon.description}</p>
                <div className="text-xl font-bold text-indigo-600">{addon.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
              자주 묻는 질문
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-6"
                >
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
              아직 고민 중이신가요?
            </h2>
            <p className="mb-8 text-lg text-indigo-100">
              전문 상담사가 귀사에 맞는 최적의 플랜을 제안해드립니다.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              무료 상담 신청하기
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
