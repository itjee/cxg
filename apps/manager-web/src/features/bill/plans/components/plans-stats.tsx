/**
 * @file plans-stats.tsx
 * @description 요금제 통계 카드 컴포넌트
 *
 * StatsCards 컴포넌트를 사용하여 주요 요금제 지표 표시
 */

'use client';

import { useMemo } from 'react';
import { DollarSign, Users, Package, TrendingUp } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { Plan } from '../types';

interface StatCardData {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  color?: "default" | "primary" | "success" | "warning" | "danger";
}

interface PlansStatsProps {
  plans: Plan[];
}

export function PlansStats({ plans }: PlansStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    // 통계 계산
    const totalPlans = plans.length;
    const activePlans = plans.filter((p) => p.status === 'ACTIVE').length;
    const totalBasePrice = plans.reduce((sum, p) => sum + p.base_price, 0);
    const avgBasePrice = plans.length > 0 ? Math.round(totalBasePrice / plans.length) : 0;
    const avgMaxUsers = plans.length > 0
      ? Math.round(
          plans.filter((p) => p.max_users).reduce((sum, p) => sum + (p.max_users || 0), 0) /
            plans.filter((p) => p.max_users).length
        )
      : 0;

    // 활성율 계산
    const activeRate = totalPlans > 0 ? ((activePlans / totalPlans) * 100).toFixed(1) : "0.0";

    return [
      {
        title: "총 요금제",
        value: totalPlans.toString(),
        description: "등록된 요금제",
        icon: <Package className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "활성 요금제",
        value: activePlans.toString(),
        description: `전체의 ${activeRate}%`,
        icon: <TrendingUp className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "평균 기본 요금",
        value: `₩${avgBasePrice.toLocaleString()}`,
        description: "KRW",
        icon: <DollarSign className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "평균 최대 사용자",
        value: avgMaxUsers.toString(),
        description: "명",
        icon: <Users className="h-5 w-5" />,
        color: "warning" as const,
      },
    ];
  }, [plans]);

  return <StatsCards cards={stats} columns={4} />;
}
