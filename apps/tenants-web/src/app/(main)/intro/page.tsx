import { Metadata } from 'next';
import {
  BarChart3,
  Users,
  Package,
  TrendingUp,
  ShoppingCart,
  FileText,
  CreditCard,
  Truck,
  Box,
  DollarSign,
  Calendar,
  Settings,
  MessageSquare,
  Bell
} from "lucide-react";

export const metadata: Metadata = {
  title: 'Features 활용방법 - ConexGrow',
  description: 'ConexGrow의 주요 기능 활용 가이드',
};

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Features 활용방법</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ConexGrow의 주요 기능을 효과적으로 활용하는 방법을 알아보세요</p>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mainFeatures.map((feature, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all group">
            <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
            <ul className="space-y-2">
              {feature.tips.map((tip, tipIndex) => (
                <li key={tipIndex} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Getting Started Guide */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
            <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">시작하기</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              ConexGrow를 처음 사용하시나요? 다음 단계를 따라 시스템을 설정하세요.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {gettingStartedSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{step.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">효율성 팁</h3>
          </div>
          <ul className="space-y-3">
            {efficiencyTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <span className="text-green-600 dark:text-green-400 font-bold text-lg">•</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{tip.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{tip.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
              <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">자주 묻는 질문</h3>
          </div>
          <ul className="space-y-3">
            {faqs.map((faq, index) => (
              <li key={index} className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{faq.question}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Help Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-lg p-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="relative">
          <h2 className="text-xl font-bold mb-2 text-white">더 많은 도움이 필요하신가요? 📚</h2>
          <p className="text-sm text-indigo-100 mb-6 max-w-2xl">
            자세한 사용 가이드, 동영상 튜토리얼, 그리고 커뮤니티 포럼을 통해 ConexGrow를 완벽하게 활용하세요.
          </p>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors font-semibold text-sm shadow-lg shadow-black/10">
              문서 보기
            </button>
            <button className="px-5 py-2.5 bg-indigo-500/30 backdrop-blur-sm text-white rounded-lg hover:bg-indigo-500/40 transition-colors font-semibold text-sm border border-white/20">
              지원 문의
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const mainFeatures = [
  {
    title: "고객 관계 관리 (CRM)",
    description: "고객 정보를 체계적으로 관리하고 상호작용을 추적하세요.",
    icon: Users,
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    tips: [
      "고객 프로필에 태그를 추가하여 세그먼트화",
      "상호작용 히스토리로 고객 관계 파악",
      "자동 알림으로 중요한 팔로우업 놓치지 않기"
    ]
  },
  {
    title: "주문 관리",
    description: "주문 생성부터 배송까지 전체 프로세스를 관리하세요.",
    icon: ShoppingCart,
    bgColor: "bg-green-100 dark:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
    tips: [
      "빠른 주문 생성으로 시간 절약",
      "주문 상태 자동 업데이트",
      "배송 추적 및 고객 알림 자동화"
    ]
  },
  {
    title: "재고 관리",
    description: "실시간으로 재고를 추적하고 최적 수준을 유지하세요.",
    icon: Package,
    bgColor: "bg-orange-100 dark:bg-orange-900/50",
    iconColor: "text-orange-600 dark:text-orange-400",
    tips: [
      "재고 부족 시 자동 알림",
      "입출고 히스토리 추적",
      "재고 조정 및 실사 기능"
    ]
  },
  {
    title: "송장 및 결제",
    description: "송장을 생성하고 결제를 효율적으로 관리하세요.",
    icon: FileText,
    bgColor: "bg-purple-100 dark:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    tips: [
      "자동 송장 생성 및 발송",
      "다양한 결제 방식 지원",
      "미수금 추적 및 알림"
    ]
  },
  {
    title: "공급망 관리 (SCM)",
    description: "공급업체와의 관계를 관리하고 조달 프로세스를 최적화하세요.",
    icon: Truck,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/50",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    tips: [
      "공급업체 정보 중앙 관리",
      "발주서 자동 생성",
      "납기일 추적 및 알림"
    ]
  },
  {
    title: "리포트 및 분석",
    description: "데이터 기반 인사이트로 더 나은 비즈니스 결정을 내리세요.",
    icon: BarChart3,
    bgColor: "bg-pink-100 dark:bg-pink-900/50",
    iconColor: "text-pink-600 dark:text-pink-400",
    tips: [
      "실시간 대시보드로 KPI 모니터링",
      "커스텀 리포트 생성",
      "데이터 내보내기 및 공유"
    ]
  },
  {
    title: "창고 관리 (WMS)",
    description: "창고 운영을 최적화하고 효율성을 높이세요.",
    icon: Box,
    bgColor: "bg-teal-100 dark:bg-teal-900/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    tips: [
      "위치 기반 재고 관리",
      "피킹 및 패킹 최적화",
      "입출고 스캔 및 추적"
    ]
  },
  {
    title: "매출 및 수익 관리",
    description: "매출을 추적하고 수익성을 분석하세요.",
    icon: DollarSign,
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    tips: [
      "매출 트렌드 분석",
      "제품별 수익성 추적",
      "예산 대비 실적 모니터링"
    ]
  },
  {
    title: "일정 및 작업 관리",
    description: "팀의 일정을 조율하고 작업을 효율적으로 배분하세요.",
    icon: Calendar,
    bgColor: "bg-red-100 dark:bg-red-900/50",
    iconColor: "text-red-600 dark:text-red-400",
    tips: [
      "공유 캘린더로 일정 조율",
      "작업 할당 및 진행 상황 추적",
      "마감일 알림 및 우선순위 설정"
    ]
  }
];

const gettingStartedSteps = [
  {
    title: "회사 정보 설정",
    description: "기본 회사 정보와 사업자 등록 정보를 입력하세요."
  },
  {
    title: "사용자 초대",
    description: "팀원들을 초대하고 역할과 권한을 설정하세요."
  },
  {
    title: "기본 데이터 등록",
    description: "고객, 제품, 공급업체 등 기본 데이터를 등록하세요."
  },
  {
    title: "워크플로우 설정",
    description: "업무 프로세스에 맞게 시스템을 커스터마이즈하세요."
  }
];

const efficiencyTips = [
  {
    title: "단축키 활용",
    description: "키보드 단축키를 사용하여 작업 속도를 높이세요. Ctrl+K로 빠른 검색을 실행할 수 있습니다."
  },
  {
    title: "일괄 작업",
    description: "여러 항목을 선택하여 한 번에 처리할 수 있습니다. 상태 변경, 태그 추가 등을 일괄로 수행하세요."
  },
  {
    title: "필터 및 정렬",
    description: "고급 필터를 사용하여 원하는 데이터를 빠르게 찾고, 자주 사용하는 필터를 저장하세요."
  },
  {
    title: "자동화 규칙",
    description: "반복 작업을 자동화 규칙으로 설정하여 시간을 절약하세요."
  },
  {
    title: "템플릿 활용",
    description: "자주 사용하는 문서나 이메일 템플릿을 만들어 재사용하세요."
  }
];

const faqs = [
  {
    question: "데이터를 가져올 수 있나요?",
    answer: "네, CSV, Excel 파일을 통해 기존 데이터를 가져올 수 있습니다. 설정 > 데이터 가져오기에서 진행하세요."
  },
  {
    question: "모바일에서도 사용할 수 있나요?",
    answer: "네, 반응형 디자인으로 모든 기기에서 최적화된 경험을 제공합니다."
  },
  {
    question: "여러 창고를 관리할 수 있나요?",
    answer: "네, 창고 관리 모듈에서 여러 창고를 등록하고 개별적으로 관리할 수 있습니다."
  },
  {
    question: "리포트를 자동으로 받을 수 있나요?",
    answer: "네, 원하는 리포트를 일정에 맞춰 이메일로 자동 발송되도록 설정할 수 있습니다."
  },
  {
    question: "데이터 백업은 어떻게 하나요?",
    answer: "시스템이 자동으로 일일 백업을 수행하며, 수동 백업도 설정 메뉴에서 가능합니다."
  }
];

