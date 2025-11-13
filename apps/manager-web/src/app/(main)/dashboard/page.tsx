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
import { useMemo } from "react";

export default function DashboardPage() {
  // Calculate stats
  const statsCards: StatCardData[] = useMemo(() => {
    return [
      {
        title: "총 테넌트",
        value: "24",
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
        value: "1,847",
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
        value: "정상",
        description: "모든 서비스 가동 중",
        icon: <Server className="h-5 w-5" />,
        color: "success",
      },
      {
        title: "시스템 활동",
        value: "342",
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
  }, []);

  const quickActions = [
    {
      label: "테넌트 생성",
      description: "새로운 테넌트 추가",
      icon: Plus,
      color: "primary" as const,
      onClick: () => console.log("Create tenant")
    },
    {
      label: "사용자 관리",
      description: "사용자 및 권한 관리",
      icon: Users,
      color: "default" as const,
      onClick: () => console.log("Manage users")
    },
    {
      label: "시스템 설정",
      description: "전역 설정 관리",
      icon: Settings,
      color: "default" as const,
      onClick: () => console.log("System settings")
    },
    {
      label: "분석 리포트",
      description: "통계 및 분석 보기",
      icon: BarChart3,
      color: "default" as const,
      onClick: () => console.log("View analytics")
    },
  ];

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
          <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">
            오늘
          </button>
          <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">
            이번 주
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg">
            이번 달
          </button>
        </div>
      </div>

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
          <ActivityFeed />
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
