'use client';

import { Metadata } from 'next';
import {
  BarChart3,
  Users,
  Package,
  TrendingUp,
  Loader2
} from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import { usePartners } from "@/features/crm/partners/hooks";
import { useActivities } from "@/features/crm/activities/hooks";
import { useOpportunities } from "@/features/crm/opportunities/hooks";
import { useMemo } from "react";

export default function OverviewPage() {
  // Fetch data from various features
  const { data: partnersData, isLoading: partnersLoading } = usePartners({ 
    page: 1, 
    limit: 100 
  });
  
  const { data: activitiesData, isLoading: activitiesLoading } = useActivities({ 
    page: 1, 
    limit: 10,
    sort: 'createdAt:desc'
  });
  
  const { data: opportunitiesData, isLoading: opportunitiesLoading } = useOpportunities({ 
    page: 1, 
    limit: 100 
  });

  // Calculate stats
  const statsCards = useMemo(() => {
    const totalPartners = partnersData?.total || 0;
    const totalOpportunities = opportunitiesData?.total || 0;
    const openOpportunities = opportunitiesData?.items?.filter((opp: any) => 
      opp.status === 'open' || opp.status === 'in_progress'
    ).length || 0;

    return [
      {
        title: "총 고객",
        value: totalPartners.toLocaleString(),
        description: partnersLoading ? "로딩 중..." : "전체 거래처",
        icon: <Users className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "영업기회",
        value: totalOpportunities.toLocaleString(),
        description: opportunitiesLoading ? "로딩 중..." : `진행 중: ${openOpportunities}건`,
        icon: <TrendingUp className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "최근 활동",
        value: (activitiesData?.total || 0).toLocaleString(),
        description: activitiesLoading ? "로딩 중..." : "전체 활동 기록",
        icon: <Package className="h-5 w-5" />,
        color: "warning" as const,
      },
      {
        title: "진행 중인 작업",
        value: openOpportunities.toLocaleString(),
        description: opportunitiesLoading ? "로딩 중..." : "활성 영업기회",
        icon: <BarChart3 className="h-5 w-5" />,
        color: "default" as const,
      },
    ];
  }, [partnersData, activitiesData, opportunitiesData, partnersLoading, activitiesLoading, opportunitiesLoading]);

  // Format recent activities from API data
  const recentActivity = useMemo(() => {
    if (!activitiesData?.items) return [];
    
    return activitiesData.items.slice(0, 5).map((activity: any) => ({
      title: activity.title || activity.type || "활동",
      description: activity.description || activity.notes || "상세 정보 없음",
      time: formatRelativeTime(activity.createdAt),
      icon: getActivityIcon(activity.type),
      bgColor: getActivityBgColor(activity.type),
      textColor: getActivityTextColor(activity.type),
    }));
  }, [activitiesData]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">홈</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">업무 현황을 한눈에 확인하세요</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            오늘
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            이번 주
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg">
            이번 달
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <StatsCards cards={statsCards} columns={4} />

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">최근 활동</h3>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
              전체보기
            </button>
          </div>
          
          {activitiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              최근 활동이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${activity.bgColor}`}>
                    <activity.icon className={`h-4 w-4 ${activity.textColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{activity.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">빠른 작업</h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                  <action.icon className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome message for new users */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-lg p-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="relative">
          <h2 className="text-xl font-bold mb-2 text-white">ConexGrow에 오신 것을 환영합니다! 🎉</h2>
          <p className="text-sm text-indigo-100 mb-6 max-w-2xl">
            모든 업무를 하나의 플랫폼에서 효율적으로 관리하세요. 시작하려면 좌측 메뉴에서 원하는 모듈을 선택하세요.
          </p>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors font-semibold text-sm shadow-lg shadow-black/10">
              시작 가이드 보기
            </button>
            <button className="px-5 py-2.5 bg-indigo-500/30 backdrop-blur-sm text-white rounded-lg hover:bg-indigo-500/40 transition-colors font-semibold text-sm border border-white/20">
              데모 영상 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const quickActions = [
  { label: "고객 추가", icon: Users },
  { label: "주문 생성", icon: TrendingUp },
  { label: "재고 조정", icon: Package },
  { label: "리포트 생성", icon: BarChart3 },
];

// Helper functions
function formatRelativeTime(dateString: string): string {
  if (!dateString) return '방금 전';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  
  return date.toLocaleDateString('ko-KR', { 
    month: 'short', 
    day: 'numeric' 
  });
}

function getActivityIcon(type?: string) {
  switch (type) {
    case 'partner':
    case 'customer':
      return Users;
    case 'opportunity':
    case 'sales':
      return TrendingUp;
    case 'meeting':
    case 'call':
      return Package;
    default:
      return BarChart3;
  }
}

function getActivityBgColor(type?: string): string {
  switch (type) {
    case 'partner':
    case 'customer':
      return 'bg-indigo-100 dark:bg-indigo-900/50';
    case 'opportunity':
    case 'sales':
      return 'bg-green-100 dark:bg-green-900/50';
    case 'meeting':
    case 'call':
      return 'bg-orange-100 dark:bg-orange-900/50';
    default:
      return 'bg-gray-100 dark:bg-gray-700/50';
  }
}

function getActivityTextColor(type?: string): string {
  switch (type) {
    case 'partner':
    case 'customer':
      return 'text-indigo-600 dark:text-indigo-400';
    case 'opportunity':
    case 'sales':
      return 'text-green-600 dark:text-green-400';
    case 'meeting':
    case 'call':
      return 'text-orange-600 dark:text-orange-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

