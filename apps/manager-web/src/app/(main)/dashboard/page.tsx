"use client";

import {
  Building2,
  Users,
  Server,
  Activity,
  TrendingUp,
  Plus,
  Settings,
  BarChart3,
  Loader2
} from "lucide-react";
import { StatsCards, StatCardData, ActivityFeed, QuickActions, TenantGrowthChart } from "@/features/dashboard";
import { useDashboardStats, useDashboardStore } from "@/features/dashboard";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { setIsRefreshing, isRefreshing } = useDashboardStore();

  // GraphQL로 대시보드 통계 조회
  const { data, loading, error, refetch } = useDashboardStats();

  // 통계 데이터를 카드 형식으로 변환
  const statsCards: StatCardData[] = useMemo(() => {
    const stats = data?.dashboard;

    if (!stats) {
      return [
        {
          title: "총 테넌트",
          value: "0",
          description: "활성 테넌트 수",
          icon: <Building2 className="h-5 w-5" />,
          color: "primary",
        },
        {
          title: "전체 사용자",
          value: "0",
          description: "등록된 사용자",
          icon: <Users className="h-5 w-5" />,
          color: "success",
        },
        {
          title: "서버 상태",
          value: "로딩 중...",
          description: "상태 확인 중",
          icon: <Server className="h-5 w-5" />,
          color: "success",
        },
        {
          title: "시스템 활동",
          value: "0",
          description: "오늘의 활동 수",
          icon: <Activity className="h-5 w-5" />,
          color: "warning",
        },
      ];
    }

    // 서버 상태 색상 결정
    const statusColor: "success" | "warning" | "danger" | "primary" | "default" =
      stats.systemStatus === "HEALTHY" ? "success" :
      stats.systemStatus === "WARNING" ? "warning" :
      "danger";

    return [
      {
        title: "총 테넌트",
        value: stats.totalTenants,
        description: "활성 테넌트 수",
        icon: <Building2 className="h-5 w-5" />,
        color: "primary",
        trend: {
          value: 12,
          isPositive: true,
          label: "지난달 대비"
        }
      },
      {
        title: "전체 사용자",
        value: stats.totalUsers.toLocaleString(),
        description: "등록된 사용자",
        icon: <Users className="h-5 w-5" />,
        color: "success",
        trend: {
          value: 8,
          isPositive: true,
          label: "지난달 대비"
        }
      },
      {
        title: "서버 상태",
        value: stats.systemStatus === "HEALTHY" ? "정상" :
               stats.systemStatus === "WARNING" ? "경고" : "심각",
        description: "모든 서비스 상태",
        icon: <Server className="h-5 w-5" />,
        color: statusColor,
      },
      {
        title: "시스템 활동",
        value: stats.todayActivities,
        description: "오늘의 활동 수",
        icon: <Activity className="h-5 w-5" />,
        color: "warning",
        trend: {
          value: 5,
          isPositive: true,
          label: "어제 대비"
        }
      },
    ];
  }, [data]);

  const quickActions = [
    {
      label: "테넌트 생성",
      description: "새로운 테넌트 추가",
      icon: Plus,
      color: "primary" as const,
      onClick: () => router.push("/tnnt/tenants/create")
    },
    {
      label: "사용자 관리",
      description: "사용자 및 권한 관리",
      icon: Users,
      color: "default" as const,
      onClick: () => router.push("/idam/users")
    },
    {
      label: "시스템 설정",
      description: "전역 설정 관리",
      icon: Settings,
      color: "default" as const,
      onClick: () => router.push("/settings")
    },
    {
      label: "분석 리포트",
      description: "통계 및 분석 보기",
      icon: BarChart3,
      color: "default" as const,
      onClick: () => router.push("/reports")
    },
  ];

  // 새로고침 핸들러
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
          <p className="text-muted-foreground mt-1">
            ConexGrow 플랫폼 관리 현황을 한눈에 확인하세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                새로고침 중...
              </span>
            ) : (
              "새로고침"
            )}
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          <p className="text-sm font-medium">데이터를 불러올 수 없습니다</p>
          <p className="text-xs text-destructive/80 mt-1">{error.message}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="animate-slide-in-left animate-delay-100">
        <StatsCards cards={statsCards} columns={4} />
      </div>

      {/* Tenant Growth Chart */}
      <div className="animate-slide-in-up animate-delay-150">
        <TenantGrowthChart />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 animate-slide-in-left animate-delay-200">
          <ActivityFeed limit={10} />
        </div>

        {/* Quick Actions */}
        <div className="animate-slide-in-right animate-delay-200">
          <QuickActions actions={quickActions} columns={1} />
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-purple-700 rounded-lg p-8 animate-scale-in animate-delay-300">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="relative">
          <h2 className="text-xl font-bold mb-2 text-white">
            ConexGrow Manager에 오신 것을 환영합니다! 🎉
          </h2>
          <p className="text-sm text-primary-foreground/90 mb-6 max-w-2xl">
            멀티테넌트 플랫폼의 모든 것을 관리하세요. 테넌트 생성부터 인프라 모니터링까지, 강력한 관리 도구를 제공합니다.
          </p>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white dark:bg-gray-800 text-primary rounded-lg hover:bg-primary-foreground/90 transition-colors font-semibold text-sm shadow-lg">
              시작 가이드 보기
            </button>
            <button className="px-5 py-2.5 bg-primary-foreground/20 backdrop-blur-sm text-white rounded-lg hover:bg-primary-foreground/30 transition-colors font-semibold text-sm border border-white/20">
              문서 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
